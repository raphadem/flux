import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { DebugConfig } from "@/config";

export class PhysicsObject {
  colliderMesh?: THREE.Mesh;

  constructor(
    public mesh: THREE.Mesh,
    public body: RAPIER.RigidBody,
    public collider: RAPIER.Collider,
    public scene: THREE.Scene
  ) {
    if (DebugConfig.drawColliders) this.renderCollider();
  }

  sync(): void {
    const pos = this.body.translation();
    const rot = this.body.rotation();
    this.mesh.position.set(pos.x, pos.y, pos.z);
    this.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);
    this.colliderMesh?.position.set(pos.x, pos.y, pos.z);
    this.colliderMesh?.quaternion.set(rot.x, rot.y, rot.z, rot.w);
  }

  renderCollider() {
    const shape = this.collider.shape;

    if (shape instanceof RAPIER.Cuboid) {
      const [hx, hy, hz] = [
        shape.halfExtents.x,
        shape.halfExtents.y,
        shape.halfExtents.z,
      ];
      const geo = new THREE.BoxGeometry(hx * 2, hy * 2, hz * 2);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
      });
      this.colliderMesh = new THREE.Mesh(geo, mat);
      this.scene.add(this.colliderMesh);
    } else if (shape instanceof RAPIER.Capsule) {
      const geo = new THREE.CapsuleGeometry(
        shape.radius,
        shape.halfHeight * 2,
        4,
        8
      );
      const mat = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
      });
      this.colliderMesh = new THREE.Mesh(geo, mat);
      this.scene.add(this.colliderMesh);
    }
  }
}
