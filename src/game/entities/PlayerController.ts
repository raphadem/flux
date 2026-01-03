import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { PlayerConfig, PhysicsConfig } from "@/config";
import { PhysicsBinding } from "@/engine/physics/PhysicsBinding";
import type { GameContext } from "@/core/GameContext";

export class PlayerController {
  // --- Physics Data ---
  public velocity = new THREE.Vector3();
  private position = new THREE.Vector3(0, 5, 0); // Start high to prevent clipping on load

  // --- State ---
  public grounded = false;
  private jumpGrace = 0;
  private jumpBuffer = 0;

  // --- Components ---
  public binding: PhysicsBinding;

  // The magic ingredient: Rapier's built-in controller
  private characterController: RAPIER.KinematicCharacterController;

  constructor(private ctx: GameContext) {
    const { scene, physics, input } = ctx;
    // 1. Create Visual Mesh
    const mesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(
        PlayerConfig.controller.radius,
        PlayerConfig.controller.height,
        4,
        8
      ),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );
    scene.scene.add(mesh);

    // 2. Create RigidBody (Kinematic Position Based)
    // We control position manually, but via the Character Controller's logic
    const bodyDesc =
      RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(
        this.position.x,
        this.position.y,
        this.position.z
      );
    const body = physics.world.createRigidBody(bodyDesc);

    // 3. Create Collider
    // Note: ActiveCollisionTypes is important so we can detect interactions if needed later
    const colliderDesc = RAPIER.ColliderDesc.capsule(
      PlayerConfig.controller.height / 2,
      PlayerConfig.controller.radius
    ).setActiveCollisionTypes(
      RAPIER.ActiveCollisionTypes.DEFAULT |
        RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED
    );
    const collider = physics.world.createCollider(colliderDesc, body);

    this.binding = new PhysicsBinding(mesh, body, collider);
    // 4. Init Character Controller
    // The offset ensures we don't tunnel through walls.
    this.characterController = physics.world.createCharacterController(
      PlayerConfig.controller.skinWidth
    );

    // Auto-step allows walking up stairs automatically
    this.characterController.enableAutostep(0.7, 0.3, true);

    // Snap to ground prevents "bunny hopping" when walking down slopes
    this.characterController.enableSnapToGround(
      PlayerConfig.controller.snapDistance
    );
    this.characterController.setMaxSlopeClimbAngle(
      PlayerConfig.controller.maxSlopeAngle
    );

    // Up direction is Y
    this.characterController.setUp({ x: 0, y: 1, z: 0 });
  }

  update(dt: number) {
    // Input Buffering (Standard Feel)
    if (this.ctx.input.isPressed("Space")) {
      this.jumpBuffer = PlayerConfig.jump.bufferTime;
    }
    if (this.jumpBuffer > 0) this.jumpBuffer -= dt;
  }

  fixedUpdate(dt: number) {
    const { input } = this.ctx;
    // 1. Update Timers
    this.jumpGrace = this.grounded
      ? PlayerConfig.jump.coyoteTime
      : this.jumpGrace - dt;

    // 2. Check Ground Status from PREVIOUS frame's resolution
    // Rapier calculates this for us during computeColliderMovement
    this.grounded = this.characterController.computedGrounded();

    // 3. Calculate Input Vector (Local to World conversion if you have a camera later)
    const inputDir = new THREE.Vector3();
    if (input.isDown("KeyW")) inputDir.z -= 1;
    if (input.isDown("KeyS")) inputDir.z += 1;
    if (input.isDown("KeyA")) inputDir.x -= 1;
    if (input.isDown("KeyD")) inputDir.x += 1;

    // Normalize to prevent diagonal speed boost
    if (inputDir.lengthSq() > 0) inputDir.normalize();

    // 4. Movement Physics (Quake/Source style acceleration)
    this.applyMovementPhysics(inputDir, dt);

    // 5. Gravity & Jumping
    this.applyGravityAndJump(dt);

    // 6. SOLVE PHYSICS (The Rapier Magic)
    // Calculate the desired translation for this frame
    const desiredTranslation = {
      x: this.velocity.x * dt,
      y: this.velocity.y * dt,
      z: this.velocity.z * dt,
    };

    // Ask Rapier: "If I move here, what do I hit?"
    this.characterController.computeColliderMovement(
      this.binding.collider,
      desiredTranslation,
      RAPIER.QueryFilterFlags.EXCLUDE_SENSORS // Don't collide with triggers
    );

    // 7. Apply the Result
    // Get the *actual* safe movement after sliding against walls/floors
    const correctedMovement = this.characterController.computedMovement();

    const newPos = this.binding.body.translation();
    newPos.x += correctedMovement.x;
    newPos.y += correctedMovement.y;
    newPos.z += correctedMovement.z;

    this.binding.body.setNextKinematicTranslation(newPos);
    this.position.set(newPos.x, newPos.y, newPos.z);

    // 9. IMPORTANT: Velocity Re-projection (Momentum Preservation)
    // If we hit a wall, our desired translation was stopped.
    // We must update our internal velocity to match the STOP, or we will "store" velocity
    // and shoot off when we step away from the wall.
    // However, we strictly rely on Rapier's slide logic for X/Z.

    // Re-calculate velocity based on what actually happened
    // This effectively handles "Wall Sliding" frictionlessly
    if (dt > 0.0001) {
      // We only re-project horizontal velocity.
      // We handle Vertical velocity separately to ensure gravity works reliably.
      // If we hit a ceiling, we want velocity.y to become 0.

      // Check for ceiling hit
      // (No direct flag, but if we moved down significantly less than desired when moving up...)
      if (
        this.velocity.y > 0 &&
        correctedMovement.y < desiredTranslation.y * 0.5
      ) {
        this.velocity.y = 0;
      }
    }
  }

  private applyMovementPhysics(inputDir: THREE.Vector3, dt: number) {
    // Determine acceleration settings
    const speed = this.grounded
      ? PlayerConfig.movement.maxGroundSpeed
      : PlayerConfig.movement.maxAirSpeed; // Can be different for air

    const accel = this.grounded
      ? PlayerConfig.movement.groundAcceleration
      : PlayerConfig.movement.airAcceleration;

    const friction = this.grounded
      ? PlayerConfig.movement.groundDeceleration // e.g. 10.0
      : PlayerConfig.movement.airDrag; // e.g. 0.0 or 0.5

    // 1. Apply Friction (Damping) first
    // We only damp horizontal speed
    const currentSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    if (currentSpeed > 0) {
      const drop = currentSpeed * friction * dt;
      const newSpeed = Math.max(currentSpeed - drop, 0);
      if (currentSpeed > 0) {
        // Divide by zero safety
        const scale = newSpeed / currentSpeed;
        this.velocity.x *= scale;
        this.velocity.z *= scale;
      }
    }

    // 2. Apply Input Acceleration
    // Project current velocity onto input direction
    const currentProj =
      this.velocity.x * inputDir.x + this.velocity.z * inputDir.z;

    // Calculate how much we can add (Quake style air control limit)
    const addSpeed = speed - currentProj;

    if (addSpeed > 0) {
      const accelSpeed = accel * dt * speed;
      const limitedAccel = Math.min(accelSpeed, addSpeed);

      this.velocity.x += inputDir.x * limitedAccel;
      this.velocity.z += inputDir.z * limitedAccel;
    }
  }

  private applyGravityAndJump(dt: number) {
    if (this.grounded && this.velocity.y <= 0) {
      // Keep us stuck to ground, but not accumulating infinite gravity
      // -2.0 ensures snapToGround works nicely
      this.velocity.y = -2.0;
    } else {
      // Apply Gravity
      this.velocity.y += PhysicsConfig.gravity.y * dt;
    }

    // Jump Logic
    if (this.jumpBuffer > 0 && this.grounded && this.jumpGrace > 0) {
      this.velocity.y = PlayerConfig.jump.impulse;
      this.grounded = false;
      this.jumpBuffer = 0;
      this.jumpGrace = PlayerConfig.jump.coyoteTime;
    }
  }
}
