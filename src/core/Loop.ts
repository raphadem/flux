import { Time } from "./Time";

export interface Updatable {
  fixedUpdate?(input: any): void;
  update?(dt: number): void;
}

export class Loop {
  private time = new Time();
  private updatables: Updatable[] = [];

  constructor(
    private systems: {
      renderer: any;
      scene: any;
      camera: any;
      physics: any;
      input: any;
    }
  ) {}

  add(updatable: Updatable) {
    this.updatables.push(updatable);
  }

  start() {
    this.systems.renderer.renderer.setAnimationLoop(this.tick);
  }

  private tick = (now: number) => {
    const { renderer, scene, camera, physics, input } = this.systems;

    input.printKeys();
    this.time.update(now);

    while (this.time.shouldStep()) {
      physics.step();

      for (const u of this.updatables) {
        u.fixedUpdate?.(input);
      }
    }

    for (const u of this.updatables) {
      u.update?.(this.time.dt);
    }

    renderer.render(scene.scene, camera.camera);
  };
}
