import { Loop } from "./Loop";
import { Input } from "./Input";
import { Renderer } from "@graphics/Renderer";
import { SceneManager } from "@graphics/Scene";
import { CameraManager } from "@graphics/Camera";
import { PhysicsWorld } from "@physics/PhysicsWorld";
import { TestCube } from "@entities/TestCube";
import { TestGround } from "@entities/TestGround";
import { createBasicLighting } from "@graphics/Lighting";

export class Game {
  private loop: Loop;

  constructor() {
    const renderer = new Renderer();
    const scene = new SceneManager();
    const camera = new CameraManager();
    const physics = new PhysicsWorld();
    const input = new Input();

    this.loop = new Loop({
      renderer,
      scene,
      camera,
      physics,
      input,
    });

    this.createGameObjects(scene, physics);
  }

  createGameObjects(scene: SceneManager, physics: PhysicsWorld) {
    const cube = new TestCube(physics.world, scene.scene, {
      x: 0,
      y: 5,
      z: 0,
    });
    const cube2 = new TestCube(physics.world, scene.scene, {
      x: -5,
      y: 5,
      z: 0,
    });
    const cube3 = new TestCube(physics.world, scene.scene, {
      x: 5,
      y: 5,
      z: 0,
    });
    const ground = new TestGround(physics.world, scene.scene);

    this.loop.add(cube);
    this.loop.add(cube2);
    this.loop.add(cube3);
    this.loop.add(ground);

    createBasicLighting(scene.scene);
  }

  start() {
    this.loop.start();
  }
}
