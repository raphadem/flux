export class Input {
  private keys = new Set<string>();

  constructor() {
    window.addEventListener("keydown", (e) => this.keys.add(e.code));
    window.addEventListener("keyup", (e) => this.keys.delete(e.code));
  }

  printKeys() {
    if (this.keys.size > 0) console.log(this.keys);
  }

  isDown(code: string): boolean {
    return this.keys.has(code);
  }

  getAxis(name: "Horizontal" | "Vertical") {
    switch (name) {
      case "Horizontal":
        return (this.isDown("KeyD") ? 1 : 0) + (this.isDown("KeyA") ? -1 : 0);
      case "Vertical":
        return (this.isDown("KeyW") ? -1 : 0) + (this.isDown("KeyS") ? 1 : 0);
    }
  }
}
