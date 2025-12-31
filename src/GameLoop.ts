import { PhysicsObject } from "./PhysicsObject";
import { PhysicsWorld } from "./PhysicsWorld";

const FIXED_DT = 1 / 60;

export class GameLoop {
  private lastTime = 0;
  private accumulator = 0;

  constructor(
    private physicsWorld: PhysicsWorld,
    private physicsObjects: PhysicsObject[],
    private render: () => void
  ) {}

  start(): void {
    requestAnimationFrame(this.loop.bind(this));
  }

  private loop(time: number): void {
    const delta = (time - this.lastTime) / 1000;
    this.lastTime = time;
    this.accumulator += delta;

    while (this.accumulator >= FIXED_DT) {
      this.physicsWorld.step();
      this.accumulator -= FIXED_DT;
    }

    // Sync three.js meshes to physics bodies
    for (const obj of this.physicsObjects) {
      obj.sync();
    }

    this.render();

    requestAnimationFrame(this.loop.bind(this));
  }
}
