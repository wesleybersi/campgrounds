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
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  constructor(
    scene: MainScene,
    x: number,
    y: number,
    multiplier: number,
    onProgress?: (progress: number) => void,
    onComplete?: () => void
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.multiplier = multiplier;
    this.onProgress = onProgress;
    this.onComplete = onComplete;
    this.scene.labour.queuedTasks.push(this);
  }
  advance(delta: number) {
    this.progress += delta * this.multiplier;
    if (this.onProgress) this.onProgress(this.progress);
    if (this.progress >= 1) {
      if (this.onComplete) this.onComplete();
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
