import MainScene from "../../../../MainScene";
import { CELL_SIZE } from "../../../../constants";
import { Group } from "../Group/Group";

export class Spawner extends Phaser.GameObjects.Rectangle {
  scene: MainScene;
  col: number;
  row: number;
  text: Phaser.GameObjects.Text;
  constructor(scene: MainScene, col: number, row: number) {
    super(
      scene,
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE,
      CELL_SIZE,
      0xff0044
    );
    this.scene = scene;
    this.col = col;
    this.row = row;
    this.text = this.scene.add.text(this.x, this.y, "S").setColor("#ffffff");
    this.setDepth(100);
    this.scene.add.existing(this);
  }
  spawn() {
    new Group(this.scene, this.col, this.row);
  }
}
