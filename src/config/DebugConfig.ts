// src/config/DebugConfig.ts
export class DebugConfig {
  static physics = true;
  static drawColliders = true;
  static showFPS = true;

  static togglePhysics() {
    this.physics = !this.physics;
  }
  static toggleDrawColliders() {
    this.drawColliders = !this.drawColliders;
  }
  static toggleShowFPS() {
    this.showFPS = !this.showFPS;
  }
}
