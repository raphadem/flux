export class Input {
  private down = new Set<string>();
  private pressed = new Set<string>();
  private released = new Set<string>();

  private enabled = true;

  constructor(target: Window = window) {
    target.addEventListener("keydown", this.onKeyDown);
    target.addEventListener("keyup", this.onKeyUp);
    target.addEventListener("blur", this.onBlur);
  }

  /* ========================
     Browser event handlers
     ======================== */

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.enabled) return;
    if (e.repeat) return; // IMPORTANT: ignore auto-repeat

    if (!this.down.has(e.code)) {
      this.down.add(e.code);
      this.pressed.add(e.code);
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    if (!this.enabled) return;

    if (this.down.has(e.code)) {
      this.down.delete(e.code);
      this.released.add(e.code);
    }
  };

  private onBlur = () => {
    // Window lost focus → clear everything
    this.down.clear();
    this.pressed.clear();
    this.released.clear();
  };

  /* ========================
     Frame lifecycle
     ======================== */

  /** Call ONCE per render frame */
  beginFrame() {
    this.pressed.clear();
    this.released.clear();
  }

  /* ========================
     Query API (used by game)
     ======================== */

  isDown(code: string): boolean {
    return this.down.has(code);
  }

  isPressed(code: string): boolean {
    return this.pressed.has(code);
  }

  isReleased(code: string): boolean {
    return this.released.has(code);
  }

  getAxis(name: "Horizontal" | "Vertical") {
    switch (name) {
      case "Horizontal":
        return (this.isDown("KeyD") ? 1 : 0) + (this.isDown("KeyA") ? -1 : 0);
      case "Vertical":
        return (this.isDown("KeyW") ? -1 : 0) + (this.isDown("KeyS") ? 1 : 0);
    }
  }

  /* ========================
     Utilities
     ======================== */

  disable() {
    this.enabled = false;
    this.onBlur();
  }

  enable() {
    this.enabled = true;
  }

  printKeys() {
    if (this.down.size > 0) console.log(this.down);
  }
}
