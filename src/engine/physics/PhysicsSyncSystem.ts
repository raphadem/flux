import { PhysicsBinding } from "@/engine/physics/PhysicsBinding";

export class PhysicsSyncSystem {
  private bindings: PhysicsBinding[] = [];

  register(binding: PhysicsBinding) {
    this.bindings.push(binding);
  }

  capturePhysicsState() {
    for (const b of this.bindings) {
      b.capture();
    }
  }

  sync(alpha: number) {
    for (const b of this.bindings) {
      b.sync(alpha);
    }
  }
}
