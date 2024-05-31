import MainScene from "../../../../MainScene";
import { Agent } from "../../../Agent/Agent";
import { Blueprint } from "./tasks/Blueprint";

export class Builder extends Agent {
  task: Blueprint | null = null;
  constructor(scene: MainScene, col: number, row: number) {
    super(scene, col, row);
    this.scene = scene;
    this.setTint(0xd3bd03);

    scene.labour.workers.add(this);
  }
  update(delta: number) {
    if (this.task) {
      //TODO Proper collision detection
      if (
        Math.abs(this.x - this.task.x) < 24 &&
        Math.abs(this.y - this.task.y) < 24
      ) {
        this.task.advance(delta);
      } else {
        if (this.path.length === 0) {
          this.goto(this.task.x, this.task.y);
          return; // Overrule super
        }
      }
    }
    super.update(delta);
  }
}
