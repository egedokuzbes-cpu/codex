export class Loop {
  private lastTime = 0;
  private running = false;
  private onUpdate: (dt: number) => void;

  constructor(onUpdate: (dt: number) => void) {
    this.onUpdate = onUpdate;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
  }

  private tick = (time: number) => {
    if (!this.running) return;
    const dt = Math.min(0.05, (time - this.lastTime) / 1000);
    this.lastTime = time;
    this.onUpdate(dt);
    requestAnimationFrame(this.tick);
  };
}

