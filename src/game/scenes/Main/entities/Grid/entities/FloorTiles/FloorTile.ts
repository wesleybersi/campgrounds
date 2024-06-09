import { absolutePos } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";

export class FloorTile extends Phaser.GameObjects.Image {
  constructor(scene: MainScene, col: number, row: number) {
    super(scene, absolutePos(col), absolutePos(row), "white-tile");
    this.setTint(0x888888);
  }
}
