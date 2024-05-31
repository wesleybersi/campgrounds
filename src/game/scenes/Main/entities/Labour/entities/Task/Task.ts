import MainScene from "../../../../MainScene";
import { Worker } from "../../types";

export class Task {
  scene: MainScene;
  x: number;
  y: number;
  progress = 0;
  multiplier = 0;
  isCompleted = false;
  worker: Worker | null = null;
  onComplete: () => void;
  constructor(
    scene: MainScene,
    x: number,
    y: number,
    multiplier: number,
    onComplete: () => void
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.multiplier = multiplier;
    this.onComplete = onComplete;
    this.scene.labour.queuedTasks.push(this);
  }
  advance(delta: number) {
    this.progress += delta * this.multiplier;
    if (this.progress >= 1) {
      this.onComplete();
      this.remove();
    }
  }
  remove() {
    this.isCompleted = true;
    const index = this.scene.labour.queuedTasks.indexOf(this);
    this.scene.labour.queuedTasks.splice(index, 1);
    if (this.worker) {
      this.worker.task = null;
    }
  }
}
