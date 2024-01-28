import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT } from "../../scenes/Main/constants";
import { Direction } from "../../types";

export class Shooter extends Phaser.GameObjects.Image {
  scene: MainScene;
  row: number;
  col: number;

  constructor(
    scene: MainScene,
    direction: Direction,
    row: number,
    col: number
  ) {
    super(
      scene,
      col * CELL_HEIGHT + CELL_HEIGHT / 2,
      row * CELL_HEIGHT + CELL_HEIGHT / 2,
      "arrow-trap",
      0
    );
    this.scene = scene;
    this.row = row;
    this.col = col;

    if (direction === "up") {
      this.setAngle(-180);
    } else if (direction === "down") {
      this.setAngle(0);
    } else if (direction === "left") {
      this.setAngle(90);
    } else if (direction === "right") {
      this.setAngle(-90);
    }
    this.setOrigin(0.5, 0.5);
    this.setDepth(12);
    this.scene.add.existing(this);

    this.scene.events.once("clear", this.remove, this);
  }
  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.destroy();
  }
}
