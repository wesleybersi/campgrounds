import MainScene from "../../MainScene";
import { CELL_SIZE } from "../../constants";

export class Notification extends Phaser.GameObjects.Text {
  constructor(scene: MainScene, message: string, x: number, y: number) {
    super(scene, x, y, message, { font: '"Press Start 2P"', fontSize: "16px" });
    this.setScale(1.5);
    scene.add.existing(this);
    this.setStroke("#333", 2);
    this.setDepth(100);
    this.y -= CELL_SIZE / 3;
    this.scene.tweens.add({
      targets: this,
      y: this.y - CELL_SIZE,
      duration: 800,
      ease: "Sine.Out",
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          alpha: 0,
          duration: 250,
          onComplete: () => this.remove(),
        });
      },
    });
  }
  remove() {
    this.destroy();
  }
}
