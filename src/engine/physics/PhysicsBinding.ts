// src/engine/physics/PhysicsBinding.ts
import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { PhysicsDebugRenderer } from "./PhysicsDebugRenderer";
import { DebugConfig } from "@/config";

export class PhysicsBinding {
  constructor(
    public mesh: THREE.Object3D,
    public body: RAPIER.RigidBody,
    public collider: RAPIER.Collider
  ) {
    // capture initial transform
    const t = body.translation();
    const r = body.rotation();
    this.prevPos.set(t.x, t.y, t.z);
    this.currPos.set(t.x, t.y, t.z);
    this.prevRot.set(r.x, r.y, r.z, r.w);
    this.currRot.set(r.x, r.y, r.z, r.w);

    // Auto-register debug mesh if debug mode is on
    if (DebugConfig.drawColliders) {
      PhysicsDebugRenderer.getInstance().watch(this);
    }
  }

  // interpolation state
  public prevPos = new THREE.Vector3();
  public currPos = new THREE.Vector3();
  public prevRot = new THREE.Quaternion();
  public currRot = new THREE.Quaternion();

  private disposeCallbacks: (() => void)[] = [];
  onDispose(cb: () => void) {
    this.disposeCallbacks.push(cb);
  }
  dispose() {
    this.disposeCallbacks.forEach((cb) => cb());
  }

  capture() {
    this.prevPos.copy(this.currPos);
    this.prevRot.copy(this.currRot);
    const t = this.body.translation();
    const r = this.body.rotation();
    this.currPos.set(t.x, t.y, t.z);
    this.currRot.set(r.x, r.y, r.z, r.w);
  }

  sync(alpha: number) {
    this.mesh.position.lerpVectors(this.prevPos, this.currPos, alpha);
    this.mesh.quaternion.slerpQuaternions(this.prevRot, this.currRot, alpha);
  }

  public static createDebugMesh(
    body: RAPIER.RigidBody,
    collider: RAPIER.Collider
  ): THREE.Mesh {
    const shape = collider.shapeType();

    let mesh!: THREE.Mesh;

    switch (shape) {
      case RAPIER.ShapeType.Cuboid: {
        const size = collider.halfExtents();
        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(size.x * 2, size.y * 2, size.z * 2),
          new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
        );
        break;
      }
      case RAPIER.ShapeType.Ball: {
        const r = collider.radius();
        mesh = new THREE.Mesh(
          new THREE.SphereGeometry(r, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
        );
        break;
      }
      case RAPIER.ShapeType.Capsule: {
        const height = collider.halfHeight();
        const radius = collider.radius();
        mesh = new THREE.Mesh(
          new THREE.CapsuleGeometry(radius, height * 2, 4, 8),
          new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
        );
        break;
      }
      case RAPIER.ShapeType.Cone: {
        const height = collider.halfHeight();
        const radius = collider.radius();
        mesh = new THREE.Mesh(
          new THREE.ConeGeometry(radius, height * 2),
          new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true })
        );
        break;
      }
      default:
        // fallback box
        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
        );
    }
    const t = body.translation();
    const r = body.rotation();
    mesh.position.set(t.x, t.y, t.z);
    mesh.quaternion.set(r.x, r.y, r.z, r.z);

    return mesh;
  }
}
