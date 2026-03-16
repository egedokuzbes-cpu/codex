export class Input {
  private keys = new Set<string>();

  constructor() {
    window.addEventListener('keydown', (event) => this.keys.add(event.code));
    window.addEventListener('keyup', (event) => this.keys.delete(event.code));
    window.addEventListener('blur', () => this.keys.clear());
  }

  isDown(code: string) {
    return this.keys.has(code);
  }

  getMovementAxis() {
    const x = (this.isDown('KeyD') ? 1 : 0) - (this.isDown('KeyA') ? 1 : 0);
    const z = (this.isDown('KeyW') ? 1 : 0) - (this.isDown('KeyS') ? 1 : 0);
    const length = Math.hypot(x, z) || 1;
    return { x: x / length, z: z / length };
  }
}

