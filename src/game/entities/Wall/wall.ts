import { CELL_SIZE } from "../../../../../../socket-shooter 2/server/src/constants";
import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT } from "../../scenes/Main/constants";
import { randomNum } from "../../utils/helper-functions";
import { autoTile } from "./methods/auto-tile";

export class Wall extends Phaser.GameObjects.Image {
  scene: MainScene;
  row: number;
  col: number;
  wallBelow: Phaser.GameObjects.Image | null = null;
  autotile = autoTile;
  constructor(scene: MainScene, row: number, col: number) {
    super(
      scene,
      col * CELL_HEIGHT + CELL_HEIGHT / 2,
      row * CELL_HEIGHT + CELL_HEIGHT / 2 - 8, //8 Being wall height
      "walls"
    );
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.setOrigin(0.5, 0.5);
    this.setTint(0x798c9a);

    scene.wallsByPos.set(`${row},${col}`, this);
    this.scene.add.existing(this);
    this.setDepth(row);

    this.scene.events.once("clear", () => {
      this.remove();
    });
  }
  addWallBelow() {
    if (
      this.scene.objectMatrix[this.row + 1] &&
      this.scene.objectMatrix[this.row + 1][this.col] &&
      this.scene.objectMatrix[this.row + 1][this.col] === "surrounded-wall"
    ) {
      return;
    } else {
      this.wallBelow = this.scene.add.image(
        this.x,
        this.y + CELL_HEIGHT - 4,
        "wall-below",
        randomNum(11)
      );
      this.scene.add.existing(this.wallBelow);
      this.wallBelow.setDepth(this.row);
      this.wallBelow.setTint(0x798c9a);
    }
  }

  remove() {
    this.scene.wallsByPos.delete(`${this.row},${this.col}`);
    if (this.wallBelow) {
      this.wallBelow.destroy();
    }
    this.destroy();
  }
}
