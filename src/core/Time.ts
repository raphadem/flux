import { PhysicsConfig } from "@/config";

export class Time {
  readonly fixedDt = PhysicsConfig.fixedDt;
  readonly dt = 0;

  private accumulator = 0;
  private lastTime = 0;

  update(now: number) {
    const dt = Math.min((now - this.lastTime) / 1000, 0.25);
    this.lastTime = now;
    this.accumulator += dt;
  }

  shouldStep(): boolean {
    if (this.accumulator >= this.fixedDt) {
      this.accumulator -= this.fixedDt;
      return true;
    }
    return false;
  }
}
