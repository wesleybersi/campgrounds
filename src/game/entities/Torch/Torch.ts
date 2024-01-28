import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT } from "../../scenes/Main/constants";
import { randomNum } from "../../utils/helper-functions";

export class Torch extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  row: number;
  col: number;
  light: Phaser.GameObjects.Image;
  constructor(scene: MainScene, row: number, col: number) {
    super(
      scene,
      col * CELL_HEIGHT + CELL_HEIGHT / 2,
      row * CELL_HEIGHT + CELL_HEIGHT / 2,
      "torch",
      0
    );
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.setOrigin(0.5, 0.5);
    this.setDepth(5);
    this.createAnimation();
    this.scene.add.existing(this);
    this.anims.play("torch");

    this.light = this.scene.add.image(this.x, this.y, "light-64").setDepth(500);

    this.scene.tweens.add({
      targets: [this.light],
      scale: 1.15,
      alpha: 0.015,
      duration: randomNum(100) + 1000,
      ease: "Sine.InOut",
      yoyo: true,
      repeat: -1,
    });
    this.light.setBlendMode(Phaser.BlendModes.SCREEN);
    this.light.setAlpha(0.025);

    this.scene.events.once("clear", this.remove, this);
  }

  createAnimation() {
    this.anims.create({
      key: "torch",
      frames: this.anims.generateFrameNumbers("torch", {
        start: 0,
        end: 4,
      }),
      frameRate: 12,
      repeat: -1,
    });
  }

  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.light.destroy();
    this.destroy();
  }
}
