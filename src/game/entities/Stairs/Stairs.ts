import { CELL_SIZE } from "../../../../../../socket-shooter 2/server/src/constants";
import MainScene from "../../scenes/Main/MainScene";

export class Stairs extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  constructor(scene: MainScene, type: string, row: number, col: number) {
    super(
      scene,
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      type.startsWith("stairs-down") ? "staircase-down" : "staircase-up",
      0
    );

    this.scene = scene;
    this.setOrigin(0.5, 0.5);
    scene.add.existing(this);

    this.setDepth(0);
    this.scene.events.once("clear", this.remove, this);
  }

  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.destroy();
  }
}
