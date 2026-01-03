import { Loop } from "./Loop";
import { Input } from "./Input";
import { Renderer } from "@/engine/graphics/Renderer";
import { SceneManager } from "@/engine/graphics/Scene";
import { CameraManager } from "@/engine/graphics/Camera";
import { PhysicsWorld } from "@/engine/physics/PhysicsWorld";
// import { Player } from "@/entities/Player";
// import { PlayerController } from "@/entities/PlayerController";
import { PlayerController } from "@/game/entities/PlayerController";
import { TestCube } from "@/game/entities/TestCube";
// import { TestGround } from "@/entities/TestGround";
import { createBasicLighting } from "@/engine/graphics/Lighting";
import { TestArena } from "@/game/entities/TestArena";
import { TestBox } from "@/game/entities/TestBox";
import type { GameContext } from "./GameContext";
import { PhysicsDebugRenderer } from "@/engine/physics/PhysicsDebugRenderer";
import { DebugConfig } from "@/config";
import { PhysicsSyncSystem } from "@/engine/physics/PhysicsSyncSystem";
import type { GameSystems } from "./GameSystems";
import { EntityFactory } from "./EntityFactory";
import { Cone } from "@/game/entities/Cone";

export class Game {
  private systems: GameSystems;
  private loop: Loop;

  constructor() {
    const ctx = {
      scene: new SceneManager(),
      physics: new PhysicsWorld(),
      input: new Input(),
    };

    this.systems = {
      ctx: ctx,
      renderer: new Renderer(),
      camera: new CameraManager(),
      physicsSync: new PhysicsSyncSystem(),
      debugRenderer: PhysicsDebugRenderer.getInstance(),
      entityFactory: new EntityFactory(ctx),
    };
    this.systems.debugRenderer.init(this.systems.ctx.scene.scene);

    this.loop = new Loop(this.systems);

    this.createGameObjects();
  }

  createGameObjects() {
    const { ctx, entityFactory, physicsSync } = this.systems;

    const arena = entityFactory.create(TestArena);
    const box = entityFactory.create(
      TestBox,
      { x: 10, y: 2, z: -5 },
      { x: 3, y: 3, z: 3 }
    );
    const player = entityFactory.create(PlayerController);
    const cube = entityFactory.create(TestCube, { x: 0, y: 5, z: -5 });
    const cube2 = entityFactory.create(TestCube, { x: -5, y: 5, z: 0 });
    const cube3 = entityFactory.create(TestCube, { x: 5, y: 5, z: 0 });
    const cone = entityFactory.create(Cone, { x: 5, y: 3, z: 5 }, 5, 5);

    this.loop.add(arena);
    this.loop.add(box);
    this.loop.add(player);
    this.loop.add(cube);
    this.loop.add(cube2);
    this.loop.add(cube3);
    this.loop.add(cone);
    for (let i = 0; i < arena.boxes.length; i++) {
      physicsSync.register(arena.boxes[i].binding);
    }
    // arena.boxes.forEach((value) => {
    //   physicsSync.register(value.binding);
    // });
    physicsSync.register(player.binding);
    physicsSync.register(box.binding);
    physicsSync.register(cube.binding);
    physicsSync.register(cube2.binding);
    physicsSync.register(cube3.binding);
    physicsSync.register(cone.binding);
    // this.loop.add(ground);

    createBasicLighting(ctx.scene.scene);
  }

  start() {
    this.loop.start();
  }
}
