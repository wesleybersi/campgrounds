import { CELL_SIZE } from "../../../../../../socket-shooter 2/server/src/constants";
import MainScene from "../../scenes/Main/MainScene";
import { SHADOW_X, SHADOW_Y, STROKE_COLOR } from "../../scenes/Main/constants";

export class ProjectileArrow extends Phaser.GameObjects.Container {
  scene: MainScene;
  id: string;
  firstImpact = false;

  base: Phaser.GameObjects.Rectangle;
  tip: Phaser.GameObjects.Triangle;
  feathers: Phaser.GameObjects.Triangle;

  // center: Phaser.GameObjects.Rectangle;

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
    const baseHeight = 128;

    this.base = this.scene.add.rectangle(
      -baseHeight / 2,
      0,
      baseHeight,
      12,
      0x937162
    );
    this.base.setStrokeStyle(4, STROKE_COLOR);

    //ANCHOR Pointy Tip
    const tipWidth = 32;
    const tipHeight = 40;

    // Create the tip triangle
    this.tip = this.scene.add.triangle(
      0,
      0,
      0,
      -tipHeight / 2,
      tipWidth / 2,
      tipHeight / 2,
      -tipWidth / 2,
      tipHeight / 2,
      0xffffff
    );

    // Set the stroke style for the tip
    this.tip.setStrokeStyle(4, STROKE_COLOR);

    // Position the tip relative to the base
    // this.tip.x = this.base.x + this.base.width / 2 + this.tip.width / 2;
    this.tip.x = this.base.x + tipHeight;
    this.tip.y = tipWidth / 2;
    this.tip.angle = 90;

    //ANCHOR Feathers

    const featherWidth = 40;
    const featherHeight = 70;
    const featherColor = color;

    // Create the tip triangle
    this.feathers = this.scene.add.triangle(
      0,
      0,
      0,
      -featherHeight / 2,
      featherWidth / 2,
      featherHeight / 2,
      -featherWidth / 2,
      featherHeight / 2,
      featherColor
    );

    // Set the stroke style for the tip
    this.feathers.setStrokeStyle(4, STROKE_COLOR);

    // Position the tip relative to the base
    // this.tip.x = this.base.x + this.base.width / 2 + this.tip.width / 2;
    this.feathers.x = -baseHeight - 8;
    this.feathers.y = featherWidth / 2;
    this.feathers.angle = 90;
    //

    // this.center = this.scene.add.rectangle(0, 0, 16, 16, 0xff0000);
    // this.center.setDepth(10000);
    // this.center.setOrigin(0.5, 0.5);
    // this.center.setAlpha(0);

    this.add([this.feathers, this.base, this.tip]);

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
        this.setDepth(0);

        // if (velocity > 2500) {
        //   if (this.scene.frameCounter % 4 === 0) {
        //     this.scene.emitter.emitSmoke(x, y);
        //   }
        // }
        // if (velocity > 3500) {
        //   this.scene.emitter.emitSmoke(x, y);
        // }

        switch (state) {
          case "active":
            if (velocity < 1000 && this.scale > 0.5) {
              this.scale -= 0.005;
            }
            break;
          case "holding":
            break;
          case "on-target":
            if (!this.firstImpact) {
              // this.scene.emitter.emitBlood(this.x, this.y);

              this.firstImpact = true;
            }
            break;
          case "on-object":
            break;
          case "on-ground":
            this.scene.tweens.add({
              targets: this,
              scale: 0.8,
              duration: 175,
              ease: "Sine.Out",
            });

            this.setDepth(0);
            return;
          case "destroyed":
          case "removed":
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
