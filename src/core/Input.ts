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
}
