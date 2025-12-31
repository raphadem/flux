import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { PhysicsObject } from "@/bindings/PhysicsObject";
import type { Updatable } from "@/core/Updatable";
import type { Input } from "@/core/Input";
import type { Vec3 } from "@/physics/Types";

export class TestCube implements Updatable {
  entity: PhysicsObject;

  constructor(
    world: RAPIER.World,
    scene: THREE.Scene,
    private input: Input,
    pos: Vec3
  ) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ color: "orange" });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic().setTranslation(pos.x, pos.y, pos.z)
    );

    world.createCollider(RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5), body);

    this.entity = new PhysicsObject(mesh, body);
  }

  fixedUpdate(fixedDt: number) {
    if (this.input.isDown("KeyR"))
      this.entity.body.setTranslation({ x: 0, y: 5, z: 0 }, true);
    this.entity.sync();
  }
}
