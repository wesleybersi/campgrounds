import MainScene from "../MainScene";

export class NightOverlay extends Phaser.GameObjects.Rectangle {
  constructor(scene: MainScene) {
    super(scene, 0, 0);
    this.setFillStyle(0x000000, 0.25);

    this.scene.add.existing(this);
  }
  update() {
    this.x = this.scene.cameras.main.worldView.x - 200;
    this.y = this.scene.cameras.main.worldView.y - 200;
    this.width = this.scene.cameras.main.worldView.width + 400;
    this.height = this.scene.cameras.main.worldView.height + 400;
  }
}
