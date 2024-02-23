import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT } from "../../scenes/Main/constants";

export class WallBelow extends Phaser.GameObjects.Image {
  scene: MainScene;
  row: number;
  col: number;
  constructor(scene: MainScene, row: number, col: number) {
    super(
      scene,
      col * CELL_HEIGHT + CELL_HEIGHT / 2,
      row * CELL_HEIGHT + CELL_HEIGHT / 2 + 4,
      "wall-below",
      0
    );
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.setOrigin(0.5, 0.5);
    this.setDepth(2);
    this.scene.add.existing(this);
    this.setTint(0x898e8f);

    this.scene.events.once("clear", this.remove, this);
    this.remove();
  }
  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.destroy();
  }
}
