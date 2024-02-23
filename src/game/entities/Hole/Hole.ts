import { CELL_WIDTH } from "./../../scenes/Main/constants";
import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT } from "../../scenes/Main/constants";

export class Hole extends Phaser.GameObjects.Rectangle {
  scene: MainScene;

  row: number;
  col: number;
  isSurrounded = false;
  bottomIsFree = false;
  wallBelow: Phaser.GameObjects.Image | null = null;

  constructor(scene: MainScene, row: number, col: number) {
    super(
      scene,
      col * CELL_HEIGHT + CELL_HEIGHT / 2,
      row * CELL_HEIGHT + CELL_HEIGHT / 2,
      CELL_WIDTH,
      CELL_HEIGHT,
      0x2f7ca9
    );
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.setOrigin(0.5, 0.5);
    this.setDepth(0);
    this.scene.add.existing(this);

    // if (
    //   this.scene.objectMatrix[row - 1] &&
    //   this.scene.objectMatrix[row - 1][col] !== "hole"
    // ) {
    //   this.wallBelow = this.scene.add.image(this.x, this.y - 4, "wall-below");
    //   this.wallBelow.setTint(0x454a4d);
    // }

    this.scene.events.once("clear", this.remove, this);
  }
  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.destroy();
    this.wallBelow?.destroy();
  }
}
