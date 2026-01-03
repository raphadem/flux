import type { GameContext } from "./GameContext";

export class EntityFactory {
  constructor(private ctx: GameContext) {}

  create<T>(
    Ctor: new (ctx: GameContext, ...args: any[]) => T,
    ...args: any[]
  ): T {
    return new Ctor(this.ctx, ...args);
  }
}
