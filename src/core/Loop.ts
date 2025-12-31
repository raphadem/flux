import { Time } from "./Time";
import { Renderer } from "@/graphics/Renderer";
import { SceneManager } from "@/graphics/Scene";
import { CameraManager } from "@/graphics/Camera";
import { PhysicsWorld } from "@/physics/PhysicsWorld";
import { Input } from "@/core/Input";
import type { Updatable } from "@/core/Updatable";
import { DebugConfig } from "@/config";

interface GameSystems {
  renderer: Renderer;
  scene: SceneManager;
  camera: CameraManager;
  physics: PhysicsWorld;
  input: Input;
}

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
    const { renderer, scene, camera, physics, input } = this.systems;

    input.printKeys();
    if (input.isPressed("KeyP")) DebugConfig.physics = !DebugConfig.physics;
    this.time.update(now);

    while (this.time.shouldStep()) {
      if (DebugConfig.physics) physics.step();

      for (const u of this.updatables) {
        u.fixedUpdate?.(this.time.fixedDt);
      }
    }

    for (const u of this.updatables) {
      u.update?.(this.time.dt);
    }

    renderer.render(scene.scene, camera.camera);
    input.beginFrame(); // needs to be at end, as input caught after frame
  };
}
