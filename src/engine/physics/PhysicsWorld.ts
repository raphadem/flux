import * as RAPIER from "@dimforge/rapier3d-compat";
await RAPIER.init();
import { PhysicsEvents } from "./PhysicsEvents";
import { PhysicsConfig } from "@/config";

export class PhysicsWorld {
  public world: RAPIER.World;
  public events: PhysicsEvents;
  private eventQueue: RAPIER.EventQueue;

  constructor() {
    this.world = new RAPIER.World(PhysicsConfig.gravity);
    this.eventQueue = new RAPIER.EventQueue(true);
    this.events = new PhysicsEvents();
  }

  step() {
    this.world.step(this.eventQueue);

    // Handle all collision events
    this.eventQueue.drainCollisionEvents((h1, h2, started) => {
      console.log("draining event");
      this.events.dispatchCollisionEvent(h1, h2, started, this.world);
    });
  }
}
