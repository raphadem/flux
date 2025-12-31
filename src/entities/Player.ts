// entities/Player.ts
import type { Updatable } from "@/core/Updatable";
import { Input } from "@/core/Input";
import { PhysicsObject } from "@/bindings/PhysicsObject";
import * as RAPIER from "@dimforge/rapier3d-compat";
import * as THREE from "three";
import { PlayerConfig } from "@/config";

export class Player implements Updatable {
  entity: PhysicsObject;
  private jumpBuffer = 0;
  private coyoteTimer = 0;

  constructor(world: RAPIER.World, scene: THREE.Scene, private input: Input) {
    const geo = new THREE.BoxGeometry(1, 2, 1);
    const mat = new THREE.MeshStandardMaterial({ color: "blue" });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 1, 0)
    );
    world.createCollider(RAPIER.ColliderDesc.cuboid(0.5, 1, 0.5), body);

    this.entity = new PhysicsObject(mesh, body);
  }

  isGrounded() {
    return true;
  }

  jump() {}

  fixedUpdate(fixedDt: number) {
    const grounded = this.isGrounded();

    // Coyote time
    if (grounded) {
      this.coyoteTimer = PlayerConfig.jump.coyoteTime;
    } else {
      this.coyoteTimer -= fixedDt;
    }

    // Can we jump?
    if (this.jumpBuffer > 0 && this.coyoteTimer > 0) {
      this.jump();
      this.jumpBuffer = 0; // consume buffer
      this.coyoteTimer = 0;
    }

    // Simple movement based on input axes
    const moveX =
      this.input.getAxis("Horizontal") * PlayerConfig.movement.speed;
    const moveZ = this.input.getAxis("Vertical") * PlayerConfig.movement.speed;

    const current = this.entity.body.translation();
    this.entity.body.setNextKinematicTranslation({
      x: current.x + moveX * fixedDt,
      y: current.y,
      z: current.z + moveZ * fixedDt,
    });

    // Sync mesh to physics
    this.entity.sync();
  }

  update(dt: number) {
    // Optional: handle camera follow, effects, animations
    // Buffer jump input
    if (this.input.isPressed("Space")) {
      this.jumpBuffer = PlayerConfig.jump.bufferTime;
    }

    if (this.jumpBuffer > 0) {
      this.jumpBuffer -= dt;
    }
  }
}
