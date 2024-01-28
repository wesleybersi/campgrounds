import MainScene from "../../scenes/Main/MainScene";

export default class ProjectilePot extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  id: string;

  constructor(
    scene: MainScene,
    id: string,
    x: number,
    y: number,
    z: number,
    angle: number
  ) {
    super(scene, x, y - z, "pots", 0);
    this.scene = scene;
    this.id = id;
    this.createAnimation();
    this.setAngle(angle);
    scene.add.existing(this);

    this.scene.events.on(
      this.id,
      (
        type: "update" | "remove",
        state: string,
        x: number,
        y: number,
        z: number,
        angle: number,
        velocity: number
      ) => {
        if (type === "remove") {
          this.hit();
          return;
        }
        this.setPosition(x, y - z);
        this.setDepth(z);

        const start_scale = 1.1;
        const end_scale = 0.65;
        const start_Z = 16;
        const end_Z = 0;

        let normalized_Z = (z - start_Z) / (end_Z - start_Z);
        normalized_Z = Math.max(0, Math.min(1, normalized_Z));

        const current_scale =
          (1 - normalized_Z) * start_scale + normalized_Z * end_scale;

        this.setScale(current_scale);
      }
    );

    this.scene.events.once("clear", this.remove, this);
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
  impact() {
    this.setActive(false);
    this.setAlpha(0);
    this.scene.emitter.emitExplosion(this.x, this.y);
    this.destroy();
  }
  remove() {
    this.scene.events.removeListener(this.id);
    this.scene.events.removeListener("clear", this.remove, this);
    this.destroy();
  }
}
