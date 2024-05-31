import MainScene from "../../../../../MainScene";
import { Tree } from "../../../../Grid/entities/Tree/Tree";
import { Notification } from "../../../../Notification/Notification";
import { Task } from "../../../entities/Task/Task";

export class Woodcutting extends Task {
  target: Tree;
  constructor(scene: MainScene, target: Tree) {
    super(scene, target.x, target.y, 0.1, () => {
      const resources = this.target.harvest();

      if (this.target instanceof Tree) {
        new Notification(this.scene, `+${resources} wood`, this.x, this.y);
        this.scene.client.inventory.materials.wood += resources;
      }
      console.log("Woodcutting task compeleted");
    });
    this.target = target;
  }
}
