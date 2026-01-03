import { Time } from "./Time";
import type { Updatable } from "@/core/Updatable";
import type { GameSystems } from "./GameSystems";
import { DebugConfig } from "@/config";

export class Loop {
  private time = new Time();
  private updatables: Updatable[] = [];

  constructor(private systems: GameSystems) {}

  add(updatable: Updatable) {
    this.updatables.push(updatable);
  }

  start() {
    this.systems.renderer.renderer.setAnimationLoop(this.tick);
  }

  private tick = (now: number) => {
    const { scene, physics, input } = this.systems.ctx;
    const { renderer, camera, physicsSync, debugRenderer } = this.systems;
    const alpha = 1;

    if (input.isPressed("KeyP")) DebugConfig.togglePhysics();
    if (input.isPressed("KeyO")) {
      DebugConfig.toggleDrawColliders();
      debugRenderer.refreshVisibility();
    }

    this.time.update(now);

    while (this.time.shouldStep()) {
      if (DebugConfig.physics) {
        physics.step();

        for (const u of this.updatables) {
          u.fixedUpdate?.(this.time.fixedDt);
        }

        physicsSync.capturePhysicsState();
      }
    }

    for (const u of this.updatables) {
      u.update?.(this.time.dt);
    }

    physicsSync.sync(alpha);
    debugRenderer.update(alpha);
    renderer.render(scene.scene, camera.camera);
    input.beginFrame();
  };
}
