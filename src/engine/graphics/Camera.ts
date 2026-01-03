import * as THREE from "three";

export class CameraManager {
  readonly camera: THREE.PerspectiveCamera;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.position.set(0, 10, 15);
    this.camera.lookAt(0, 0, 0);
  }
}
