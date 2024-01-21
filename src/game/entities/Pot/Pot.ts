import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT } from "../../scenes/Main/constants";

export class Pot extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  row: number;
  col: number;

  constructor(scene: MainScene, row: number, col: number) {
    super(
      scene,
      col * CELL_HEIGHT + CELL_HEIGHT / 2,
      row * CELL_HEIGHT + CELL_HEIGHT / 2,
      "pots",
      0
    );
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.setOrigin(0.5, 0.5);
    this.setDepth(0);
    this.createAnimation();
    this.scene.add.existing(this);
    this.scene.potsByPos.set(`${row},${col}`, this);

    this.scene.events.on("clear", () => {
      this.destroy();
    });
  }
  remove() {
    this.anims.play("destroy-pot");
    this.scene.emitter.emitSmoke(this.x, this.y);
    this.on("animationcomplete", () => {
      this.destroy();
    });
  }
  createAnimation() {
    this.anims.create({
      key: "destroy-pot",
      frames: this.anims.generateFrameNumbers("pots", {
        start: 0,
        end: 2,
      }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true,
    });
  }
}
