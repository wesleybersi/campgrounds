import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT, CELL_WIDTH } from "../../scenes/Main/constants";

export class Pickup extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  type: string;
  row: number;
  col: number;
  constructor(scene: MainScene, row: number, col: number, type: string) {
    super(
      scene,
      col * CELL_WIDTH + CELL_WIDTH / 2,
      row * CELL_HEIGHT + CELL_HEIGHT / 2,
      type.toLowerCase()
    );
    this.scene = scene;
    this.type = type;
    this.row = row;
    this.col = col;
    this.setOrigin(0.5, 0.5);
    this.setScale(0);

    this.scene.emitter.emitSmoke(this.x, this.y);
    this.scene.tweens.add({
      targets: this,
      duration: 1000,
      ease: "Sine.In",
      scale: 0.45,
      onComplete: () => {
        if (this.scene) {
          this.scene.tweens.add({
            targets: this,
            duration: 650,
            yoyo: true,
            repeat: Infinity,
            scale: 0.55,
          });
        }
      },
    });

    scene.pickupsByPos.set(`${row},${col}`, this);
    scene.add.existing(this);
  }
  update(type: string, tier: string) {
    this.setTexture(type.toLowerCase());
    this.scene.emitter.emitSmoke(this.x, this.y);
  }
  remove() {
    this.scene.emitter.emitSmoke(this.x, this.y);
    this.scene.pickupsByPos.delete(`${this.row},${this.col}`);

    this.destroy();
  }
}
