import MainScene from "../../../scenes/Main/MainScene";

export class Coin extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  id: string;

  constructor(scene: MainScene, id: string, x: number, y: number) {
    super(scene, x, y, "coin", 0);
    this.scene = scene;
    this.id = id;
    this.setOrigin(0.5, 0.5);
    this.setDepth(4);
    this.createAnimation();
    this.anims.play("spin");
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

  get() {
    this.scene.emitter.emitSmoke(this.x, this.y);
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

  createAnimation() {
    this.anims.create({
      key: "spin",
      frames: this.anims.generateFrameNumbers("coin", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });
  }
}
