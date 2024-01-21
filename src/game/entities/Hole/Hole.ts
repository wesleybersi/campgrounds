import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT } from "../../scenes/Main/constants";

export class Hole extends Phaser.GameObjects.Image {
  scene: MainScene;

  row: number;
  col: number;
  isSurrounded = false;
  bottomIsFree = false;
  wallBelow: Phaser.GameObjects.Sprite | null = null;

  constructor(scene: MainScene, row: number, col: number) {
    super(
      scene,
      col * CELL_HEIGHT + CELL_HEIGHT / 2,
      row * CELL_HEIGHT + CELL_HEIGHT / 2,
      "holes",
      2
    );
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.setOrigin(0.5, 0.5);
    this.setDepth(0);
    this.scene.add.existing(this);
    this.scene.holesByPos.set(`${row},${col}`, this);
  }
  remove() {
    this.destroy();
  }
}
