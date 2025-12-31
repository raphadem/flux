import RAPIER from "@dimforge/rapier3d-compat";

export class PhysicsWorld {
  world: RAPIER.World;

  constructor() {
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  }

  step(): void {
    this.world.step();
  }
}
