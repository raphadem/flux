import * as THREE from "three";

export function createBasicLighting(scene: THREE.Scene) {
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  const sun = new THREE.DirectionalLight(0xffffff, 1);

  sun.position.set(10, 20, 10);

  scene.add(ambient, sun);
}
