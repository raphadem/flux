import RAPIER from "@dimforge/rapier3d-compat";
await RAPIER.init();
import { PhysicsConfig } from "@/config";

export class PhysicsWorld {
  world: RAPIER.World;

  constructor() {
    this.world = new RAPIER.World(PhysicsConfig.gravity);
  }

  step(): void {
    this.world.step();
  }
}
