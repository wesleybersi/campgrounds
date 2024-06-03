import { absolutePos } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";

import { Agent } from "../../../Agent/Agent";
import { Task } from "../../entities/Task/Task";

export class Builder extends Agent {
  task: Task | null = null;
  hat: Phaser.GameObjects.Sprite;
  constructor(scene: MainScene, col: number, row: number) {
    super(scene, col, row);
    this.scene = scene;

    this.hat = this.scene.add
      .sprite(absolutePos(col), absolutePos(row), "helmet")
      .setTint(0xd3bd03)
      .setOrigin(0.5, 0.6);
    scene.labour.workers.add(this);
  }
  update(delta: number) {
    this.hat.x = this.x;
    this.hat.y = this.y;
    this.hat.setDepth(this.depth + 2);

    if (this.task) {
      if (this.col === this.task.col && this.row === this.task.row) {
        this.task.advance(delta);
      } else {
        if (this.path.length === 0) {
          this.goto(this.task.col, this.task.row);
          return; // Overrule super, so no random movement
        }
      }
    }
    super.update(delta);
  }
}
