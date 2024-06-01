import MainScene from "../../../../../MainScene";
import { CELL_SIZE } from "../../../../../constants";
import { Rock } from "../../../../Grid/entities/Rock/Rock";
import { Tree } from "../../../../Grid/entities/Tree/Tree";
import { Notification } from "../../../../Notification/Notification";
import { Task } from "../../../entities/Task/Task";

export class CutStone extends Task {
  target: Rock;
  constructor(scene: MainScene, target: Rock) {
    super(
      scene,
      target.col * CELL_SIZE,
      (target.row + 1) * CELL_SIZE,
      0.1,
      undefined,
      () => {
        const resources = this.target.harvest();

        if (this.target instanceof Tree) {
          new Notification(this.scene, `+${resources} stone`, this.x, this.y);
          this.scene.client.inventory.materials.stone += resources;
        }
        console.log("Stonecutting task completed");
      }
    );
    this.target = target;
  }
}
