import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { PhysicsBinding } from "@/engine/physics/PhysicsBinding";
import type { Updatable } from "@/core/Updatable";
import type { Input } from "@/core/Input";
import type { Vec3 } from "@/engine/physics/Types";
import type { GameContext } from "@/core/GameContext";

export class TestCube implements Updatable {
  binding: PhysicsBinding;
  private readonly input;

  constructor(ctx: GameContext, pos: Vec3) {
    const { scene, physics, input } = ctx;
    this.input = input;

    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ color: "orange" });
    const mesh = new THREE.Mesh(geo, mat);
    scene.scene.add(mesh);

    const body = physics.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic().setTranslation(pos.x, pos.y, pos.z)
    );

    const collider = physics.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5),
      body
    );

    this.binding = new PhysicsBinding(mesh, body, collider);
  }

  fixedUpdate(fixedDt: number) {
    if (this.input.isDown("KeyR"))
      this.binding.body.setTranslation({ x: 0, y: 5, z: 0 }, true);
  }
}
