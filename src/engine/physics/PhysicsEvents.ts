import * as RAPIER from "@dimforge/rapier3d-compat";

type CollisionCallback = (other: RAPIER.Collider, started: boolean) => void;

export class PhysicsEvents {
  private collisionEnter: Map<RAPIER.Collider, CollisionCallback[]> = new Map();
  private collisionExit: Map<RAPIER.Collider, CollisionCallback[]> = new Map();

  subscribe(
    collider: RAPIER.Collider,
    startedCallback?: CollisionCallback,
    exitedCallback?: CollisionCallback
  ) {
    if (startedCallback) {
      if (!this.collisionEnter.has(collider))
        this.collisionEnter.set(collider, []);
      this.collisionEnter.get(collider)!.push(startedCallback);
    }

    if (exitedCallback) {
      if (!this.collisionExit.has(collider))
        this.collisionExit.set(collider, []);
      this.collisionExit.get(collider)!.push(exitedCallback);
    }
  }

  unsubscribe(collider: RAPIER.Collider) {
    this.collisionEnter.delete(collider);
    this.collisionExit.delete(collider);
  }

  // Called by PhysicsWorld after world.step()
  dispatchCollisionEvent(
    h1: RAPIER.ColliderHandle,
    h2: RAPIER.ColliderHandle,
    started: boolean,
    world: RAPIER.World
  ) {
    const c1 = world.getCollider(h1);
    const c2 = world.getCollider(h2);
    if (!c1 || !c2) return;

    const callbacks1 = started
      ? this.collisionEnter.get(c1)
      : this.collisionExit.get(c1);
    const callbacks2 = started
      ? this.collisionEnter.get(c2)
      : this.collisionExit.get(c2);

    callbacks1?.forEach((cb) => cb(c2, started));
    callbacks2?.forEach((cb) => cb(c1, started));
  }
}
