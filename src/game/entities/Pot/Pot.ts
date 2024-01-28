import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT } from "../../scenes/Main/constants";

export class Pot extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  id: string;

  constructor(scene: MainScene, id: string, x: number, y: number) {
    super(scene, x, y, "pots", 0);
    this.scene = scene;
    this.id = id;
    this.setOrigin(0.5, 0.5);
    this.setDepth(0);
    this.createAnimation();
    this.scene.add.existing(this);

    this.scene.events.on(
      this.id,
      (type: "remove" | "update" | "hit", x?: number, y?: number) => {
        switch (type) {
          case "remove":
            this.remove();
            break;
          case "hit":
            this.hit();
            break;
          case "update":
            this.update(x ?? 0, y ?? 0);
            break;
        }
      }
    );
    this.scene.events.once("clear", this.remove, this);
  }
  remove() {
    this.scene.events.removeListener(this.id);
    this.scene.events.removeListener("clear", this.remove, this);
    this.destroy();
  }
  hit() {
    this.anims.play("destroy-pot");
    this.scene.emitter.emitSmoke(this.x, this.y);
    this.on("animationcomplete", () => {
      this.remove();
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
  update(x: number, y: number) {
    this.setPosition(x, y);
    this.setDepth(2000);
  }
}
