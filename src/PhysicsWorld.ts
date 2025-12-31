import RAPIER from "@dimforge/rapier3d-compat";
import config from "@core/Config";

export class PhysicsWorld {
  world: RAPIER.World;

  constructor() {
    this.world = new RAPIER.World(config.gravity);
  }

  step(): void {
    this.world.step();
  }
}
