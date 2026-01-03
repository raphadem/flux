import type { Updatable } from "@/core/Updatable";
import type { GameContext } from "@/core/GameContext";
import { TestBox } from "./TestBox";

export class TestArena implements Updatable {
  boxes: TestBox[];

  constructor(ctx: GameContext) {
    this.boxes = [
      new TestBox(ctx, { x: 0, y: 0, z: 0 }, { x: 50, y: 1, z: 50 }),
      new TestBox(ctx, { x: -26, y: 0, z: 0 }, { x: 2, y: 10, z: 50 }),
      new TestBox(ctx, { x: 26, y: 0, z: 0 }, { x: 2, y: 10, z: 50 }),
      new TestBox(ctx, { x: 0, y: 0, z: -26 }, { x: 50, y: 10, z: 2 }),
      new TestBox(ctx, { x: 0, y: 0, z: 26 }, { x: 50, y: 10, z: 2 }),
    ];
  }

  fixedUpdate(dt: number) {}
}
