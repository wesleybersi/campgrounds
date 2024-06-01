import MainScene from "../../../../../MainScene";
import { CELL_SIZE } from "../../../../../constants";
import { Tree, treeSets } from "../../../../Grid/entities/Tree/Tree";
import { Task } from "../../../entities/Task/Task";

export class PlantTree extends Task {
  graphic: Phaser.GameObjects.Arc;
  constructor(scene: MainScene, x: number, y: number, set: number) {
    super(scene, x, y, 0.1, undefined, () => {
      console.log("Tree planted");
      new Tree(
        this.scene.grid,
        null,
        Math.floor(x / CELL_SIZE),
        Math.floor(y / CELL_SIZE),
        set
      );
      this.graphic.destroy();
    });
    this.graphic = this.scene.add.arc(x, y, CELL_SIZE / 4);
    this.graphic.setFillStyle(0x008844).setOrigin(0.5, 0.5);
  }
}
