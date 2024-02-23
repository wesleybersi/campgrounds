import { CELL_SIZE } from "../../../../../../socket-shooter 2/server/src/constants";
import MainScene from "../../scenes/Main/MainScene";
import { SHADOW_X, SHADOW_Y, STROKE_COLOR } from "../../scenes/Main/constants";

export class ProjectileBoomerang extends Phaser.GameObjects.Container {
  scene: MainScene;
  id: string;
  firstImpact = false;

  base1: Phaser.GameObjects.Rectangle;
  base2: Phaser.GameObjects.Rectangle;

  center: Phaser.GameObjects.Rectangle;

  rotationTween: Phaser.Tweens.Tween | null = null;

  constructor(
    scene: MainScene,
    id: string,
    x: number,
    y: number,
    angle: number,
    color: number
  ) {
    super(scene, x, y);
    this.scene = scene;
    this.id = id;
    this.setAngle(angle);

    //ANCHOR Base
    const height = 100;
    const width = 40;

    this.base1 = this.scene.add.rectangle(
      0,
      height / 2,
      width,
      height,
      0x937162
    );
    this.base1.setStrokeStyle(6, STROKE_COLOR);

    this.base2 = this.scene.add.rectangle(
      -height / 2,
      0,
      width,
      height,
      0x937162
    );
    this.base2.setStrokeStyle(6, STROKE_COLOR);
    this.base2.setAngle(90);

    this.center = this.scene.add.rectangle(0, 0, 16, 16, 0xff0000);
    this.center.setDepth(10000);
    // this.center.setOrigin(0.5, 0.5);
    // this.center.setAlpha(0);

    this.add([this.base1, this.base2]);

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
          this.remove();
          return;
        }
        this.setPosition(x, y);
        this.setAngle(angle);

        if (velocity > 2500) {
          if (this.scene.frameCounter % 4 === 0) {
            this.scene.emitter.emitSmoke(x, y);
          }
        }
        if (velocity > 3500) {
          this.scene.emitter.emitSmoke(x, y);
        }

        switch (state) {
          case "active":
            if (!this.rotationTween) {
              this.rotationTween = this.scene.tweens.add({
                targets: this,
                duration: 500,
                angle: 360,
                repeat: -1,
                ease: "Linear",
              });
            }
            this.setDepth(2);
            break;
          case "holding":
            this.setDepth(1);
            break;
          case "on-target":
            if (!this.firstImpact) {
              this.scene.emitter.emitBlood(this.x, this.y);

              this.firstImpact = true;
            }
            this.rotationTween?.destroy();
            this.rotationTween = null;
            break;
          case "on-object":
            this.setAlpha(1);
            this.setDepth(1);
            this.rotationTween?.destroy();
            this.rotationTween = null;
            break;
          case "on-ground":
            this.scene.tweens.add({
              targets: this,
              scale: 0.8,
              duration: 175,
              ease: "Sine.Out",
            });
            this.rotationTween?.destroy();
            this.rotationTween = null;
            this.setDepth(0);
            return;
          case "destroyed":
          case "removed":
            this.rotationTween?.destroy();
            this.rotationTween = null;
            this.remove();
            break;
        }
      }
    );

    this.scene.events.once("clear", this.remove, this);
  }

  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.scene.events.removeListener(this.id);

    this.destroy();
  }
}
