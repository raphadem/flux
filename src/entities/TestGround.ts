import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { PhysicsObject } from "@bindings/PhysicsObject";
import type { Updatable } from "@core/Loop";

export class TestGround implements Updatable {
  entity: PhysicsObject;

  constructor(world: RAPIER.World, scene: THREE.Scene) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(50, 0.1, 50),
      new THREE.MeshStandardMaterial({ color: 0x888888 })
    );
    scene.add(mesh);

    const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
    world.createCollider(RAPIER.ColliderDesc.cuboid(25, 0.05, 25), body);

    this.entity = new PhysicsObject(mesh, body);
  }

  fixedUpdate() {
    this.entity.sync();
  }
}
