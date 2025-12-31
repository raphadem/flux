import { PhysicsObject } from "./PhysicsObject";
import { PhysicsWorld } from "./PhysicsWorld";
import config from "@core/Config";

export class GameLoop {
  private lastTime = 0;
  private accumulator = 0;

  constructor(
    private physicsWorld: PhysicsWorld,
    private physicsObjects: PhysicsObject[],
    private render: () => void
  ) {}

  start(): void {
    requestAnimationFrame(this.loop);
  }

  private loop = (time: number): void => {
    const delta = (time - this.lastTime) / 1000;
    this.lastTime = time;
    this.accumulator += delta;

    while (this.accumulator >= config.fixedDt) {
      this.physicsWorld.step();
      this.accumulator -= config.fixedDt;
    }

    // Sync three.js meshes to physics bodies
    for (const obj of this.physicsObjects) {
      obj.sync();
    }

    this.render();

    requestAnimationFrame(this.loop.bind(this));
  };
}
