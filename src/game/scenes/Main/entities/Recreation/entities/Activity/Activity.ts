import MainScene from "../../../../MainScene";
import { Guest } from "../Guest/Guest";

export class Activity {
  scene: MainScene;
  progress = 0;
  x: number;
  y: number;
  multiplier = 0;
  isCompleted = false;
  guests = new Set<Guest>();

  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  constructor(
    scene: MainScene,
    guests: Set<Guest>,
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
    this.guests = guests;
    for (const guest of guests) {
      guest.activity = this;
    }
    this.onProgress = onProgress;
    this.onComplete = onComplete;
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
    for (const guest of this.guests) {
      guest.activity = null;
    }
    this.isCompleted = true;
  }
}
