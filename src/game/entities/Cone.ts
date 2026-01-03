import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import type { GameContext } from "@/core/GameContext";
import { PhysicsBinding } from "@/engine/physics/PhysicsBinding";
import type { Updatable } from "@/core/Updatable";
import type { Vec3 } from "@/engine/physics/Types";

export class Cone implements Updatable {
  public binding: PhysicsBinding;

  constructor(ctx: GameContext, pos: Vec3, height: number, radius: number) {
    const { scene, physics, input } = ctx;

    const geo = new THREE.ConeGeometry(radius, height);
    const mat = new THREE.MeshStandardMaterial({ color: "gray" });
    const mesh = new THREE.Mesh(geo, mat);
    scene.scene.add(mesh);

    const body = physics.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(pos.x, pos.y, pos.z)
    );

    const collider = physics.world.createCollider(
      RAPIER.ColliderDesc.cone(height / 2, radius),
      body
    );

    this.binding = new PhysicsBinding(mesh, body, collider);
  }

  fixedUpdate(dt: number): void {}
}
