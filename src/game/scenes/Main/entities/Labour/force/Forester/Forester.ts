import MainScene from "../../../../MainScene";
import { Agent } from "../../../Agent/Agent";
import { PlantTree } from "./tasks/PlantTree";
import { CutWood } from "./tasks/CutWood";
import { CutStone } from "./tasks/CutStone";

export class Forester extends Agent {
  task: CutWood | CutStone | PlantTree | null = null;
  constructor(scene: MainScene, col: number, row: number) {
    super(scene, col, row);

    this.scene = scene;
    this.setTint(0x3f642f);

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
