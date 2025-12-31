import RAPIER from "@dimforge/rapier3d-compat";
await RAPIER.init();
import Config from "@core/Config";

export class PhysicsWorld {
  world: RAPIER.World;

  constructor() {
    this.world = new RAPIER.World(Config.physics.gravity);
  }

  step(): void {
    this.world.step();
  }
}
