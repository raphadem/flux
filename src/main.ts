import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
await RAPIER.init();
import { PhysicsObject } from "./PhysicsObject";
import { PhysicsWorld } from "./PhysicsWorld";
import { GameLoop } from "./GameLoop";

async function main() {
  // --- THREE.JS SETUP ---
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 10);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7);
  scene.add(light);

  // --- PHYSICS SETUP ---
  const physicsWorld = new PhysicsWorld();
  const physicsObjects: PhysicsObject[] = [];

  // Static ground
  const groundMesh = new THREE.Mesh(
    new THREE.BoxGeometry(50, 0.1, 50),
    new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  scene.add(groundMesh);

  const groundBody = physicsWorld.world.createRigidBody(
    RAPIER.RigidBodyDesc.fixed()
  );
  physicsWorld.world.createCollider(
    RAPIER.ColliderDesc.cuboid(25, 0.05, 25),
    groundBody
  );

  // Dynamic cube
  const cubeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  scene.add(cubeMesh);

  const cubeBody = physicsWorld.world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0)
  );
  physicsWorld.world.createCollider(
    RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5),
    cubeBody
  );

  physicsObjects.push(new PhysicsObject(cubeMesh, cubeBody));

  // --- GAME LOOP ---
  const gameLoop = new GameLoop(physicsWorld, physicsObjects, () =>
    renderer.render(scene, camera)
  );
  gameLoop.start();
}

main();
