// entities/Player.ts
import type { Updatable } from "@core/Updatable";
import { Input } from "@core/Input";
import { PhysicsObject } from "@bindings/PhysicsObject";
import * as RAPIER from "@dimforge/rapier3d-compat";
import * as THREE from "three";

export class Player implements Updatable {
  entity: PhysicsObject;
  speed = 10;

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

  fixedUpdate(fixedDt: number) {
    // Simple movement based on input axes
    const moveX = this.input.getAxis("Horizontal") * this.speed;
    const moveZ = this.input.getAxis("Vertical") * this.speed;

    const current = this.entity.body.translation();
    this.entity.body.setNextKinematicTranslation({
      x: current.x + moveX * fixedDt,
      y: current.y,
      z: current.z + moveZ * fixedDt,
    });

    // Sync mesh to physics
    this.entity.sync();
  }

  // update(dt: number) {
  //   // Optional: handle camera follow, effects, animations
  // }
}
