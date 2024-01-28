import MainScene from "../../../scenes/Main/MainScene";

export class ArrowPickup extends Phaser.GameObjects.Sprite {
  scene: MainScene;

  id: string;

  constructor(scene: MainScene, id: string, x: number, y: number) {
    super(scene, x, y, "arrow");
    this.scene = scene;
    this.id = id;
    this.setOrigin(0.5, 0.5);
    this.setDepth(4);
    this.scene.add.existing(this);

    this.scene.events.on(`${id}`, (type: "get" | "flash") => {
      switch (type) {
        case "get":
          this.get();
          break;
        case "flash":
          this.flash();
          break;
      }
    });

    this.scene.events.once("clear", this.remove, this);
  }
  clear() {
    this.remove();
  }
  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.scene.events.removeListener(this.id);
    this.destroy();
  }
  flash() {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      ease: "Cubic",
      duration: 128,
      repeat: -1,
      yoyo: true,
    });
  }
  get() {
    this.scene.emitter.emitSmoke(this.x, this.y);
    this.remove();
  }
}
