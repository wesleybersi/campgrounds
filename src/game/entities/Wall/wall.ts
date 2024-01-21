import { CELL_SIZE } from "../../../../../../socket-shooter 2/server/src/constants";
import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT } from "../../scenes/Main/constants";
import { autoTile } from "./methods/auto-tile";

export class Wall extends Phaser.GameObjects.Image {
  scene: MainScene;

  row: number;
  col: number;
  size: number;
  isSurrounded = false;
  bottomIsFree = false;
  wallBelow: Phaser.GameObjects.Sprite | null = null;
  autotile = autoTile;
  constructor(
    scene: MainScene,
    row: number,
    col: number,
    size: 8 | 16 | 32 | 48 | 64 | 96 | 128
  ) {
    super(
      scene,
      col * CELL_HEIGHT + CELL_HEIGHT / 2,
      row * CELL_HEIGHT + CELL_HEIGHT / 2 - size,
      "walls"
    );
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.size = size;
    this.setOrigin(0.5, 0.5);

    scene.wallsByPos.set(`${row},${col}`, this);
    this.scene.add.existing(this);
    this.setDepth(row);
  }
  remove() {
    this.scene.wallsByPos.delete(`${this.row},${this.col}`);
    if (this.wallBelow) {
      this.wallBelow.destroy();
    }
    this.destroy();
  }
}
