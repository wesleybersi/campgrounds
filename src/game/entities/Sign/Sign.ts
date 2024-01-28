import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT } from "../../scenes/Main/constants";
import { randomNum } from "../../utils/helper-functions";

export class Sign extends Phaser.GameObjects.Image {
  scene: MainScene;

  row: number;
  col: number;

  constructor(scene: MainScene, row: number, col: number) {
    super(
      scene,
      col * CELL_HEIGHT + CELL_HEIGHT / 2,
      row * CELL_HEIGHT,
      "signs",
      0
    );
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.setOrigin(0.5, 0.5);
    this.setDepth(200);
    this.scene.add.existing(this);

    this.scene.events.once("clear", this.remove, this);
  }
  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.destroy();
  }
}
