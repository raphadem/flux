// src/engine/physics/PhysicsDebugRenderer.ts
import * as THREE from "three";
import { PhysicsBinding } from "./PhysicsBinding";
import { DebugConfig } from "@/config";

export class PhysicsDebugRenderer {
  private static instance: PhysicsDebugRenderer;
  private scene!: THREE.Scene;
  private debugObjects = new Map<PhysicsBinding, THREE.Mesh>();

  private constructor() {}

  static getInstance(): PhysicsDebugRenderer {
    if (!PhysicsDebugRenderer.instance) {
      PhysicsDebugRenderer.instance = new PhysicsDebugRenderer();
    }
    return PhysicsDebugRenderer.instance;
  }

  init(scene: THREE.Scene) {
    this.scene = scene;
  }

  watch(binding: PhysicsBinding) {
    if (!DebugConfig.drawColliders) return;
    if (this.debugObjects.has(binding)) return;

    const mesh = PhysicsBinding.createDebugMesh(binding.body, binding.collider);
    this.scene.add(mesh);
    this.debugObjects.set(binding, mesh);

    binding.onDispose(() => this.unwatch(binding));
  }

  unwatch(binding: PhysicsBinding) {
    const mesh = this.debugObjects.get(binding);
    if (!mesh) return;
    this.scene.remove(mesh);
    this.debugObjects.delete(binding);
  }

  update(alpha: number) {
    if (!DebugConfig.drawColliders) return;
    for (const [binding, mesh] of this.debugObjects.entries()) {
      mesh.position.lerpVectors(binding.prevPos, binding.currPos, alpha);
      mesh.quaternion.slerpQuaternions(binding.prevRot, binding.currRot, alpha);
    }
  }

  refreshVisibility() {
    const visible = DebugConfig.drawColliders;
    for (const mesh of this.debugObjects.values()) mesh.visible = visible;
  }
}
