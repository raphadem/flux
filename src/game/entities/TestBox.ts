import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { PhysicsBinding } from "@/engine/physics/PhysicsBinding";
import type { Updatable } from "@/core/Updatable";
import type { Vec3 } from "@/engine/physics/Types";
import type { GameContext } from "@/core/GameContext";
import { Input } from "@/core/Input";

export class TestBox implements Updatable {
  binding: PhysicsBinding;
  private readonly input: Input;

  constructor(ctx: GameContext, pos: Vec3, size: Vec3) {
    const { scene, physics, input } = ctx;
    this.input = input;

    const geo = new THREE.BoxGeometry(size.x, size.y, size.z);
    const mat = new THREE.MeshStandardMaterial({ color: "gray" });
    const mesh = new THREE.Mesh(geo, mat);
    scene.scene.add(mesh);

    const body = physics.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(pos.x, pos.y, pos.z)
    );

    const collider = physics.world.createCollider(
      RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2),
      body
    );

    this.binding = new PhysicsBinding(mesh, body, collider);
  }

  fixedUpdate(dt: number) {}
}
