import { CELL_SIZE } from "../../../../../../socket-shooter 2/server/src/constants";
import MainScene from "../../scenes/Main/MainScene";
import { SHADOW_X, SHADOW_Y } from "../../scenes/Main/constants";

export class ProjectileSpear extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  id: string;
  firstImpact = false;
  shadow: Phaser.GameObjects.Sprite;
  constructor(
    scene: MainScene,
    id: string,
    x: number,
    y: number,
    angle: number
  ) {
    super(scene, x, y, "spear", 0);
    this.scene = scene;
    this.id = id;
    this.setAngle(angle);
    this.setScale(1);
    this.setOrigin(0.5, 0.5);

    this.shadow = this.scene.add.sprite(this.x, this.y, "spear", 0);
    this.shadow.setScale(8);
    this.shadow.setTint(0x222222);
    this.shadow.setOrigin(0.5, 0.5);
    this.shadow.setAlpha(0.25);
    this.shadow.setDepth(0);
    scene.add.existing(this.shadow);
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

        this.shadow.setPosition(x + SHADOW_X, y + SHADOW_Y);
        this.shadow.setAngle(angle);

        switch (state) {
          case "active":
            if (velocity < 250 && this.scale > 0.8) {
              this.scale -= 0.005;
              this.shadow.scale -= 0.005;
              this.shadow.alpha -= 0.005;
              this.setDepth(10);
            }
            this.setDepth(2);
            break;
          case "holding":
            this.setDepth(10);
            this.shadow.setAlpha(0);
            break;
          case "on-target":
            if (!this.firstImpact) {
              this.scene.emitter.emitBlood(this.x, this.y);
              this.setScale(1);
              this.setAlpha(1);
              this.setDepth(1);

              this.shadow.setScale(1);
              this.shadow.setAlpha(1);
              this.shadow.setDepth(0);

              this.firstImpact = true;
            }
            break;
          case "on-object":
            this.setScale(0.75);
            this.setAlpha(1);
            this.setDepth(1);
            break;
          case "on-ground":
            this.scene.tweens.add({
              targets: this,
              scale: 0.8,
              duration: 175,
              ease: "Sine.Out",
            });
            this.scene.tweens.add({
              targets: this.shadow,
              scale: 0.5,
              alpha: 0,
              duration: 175,
              ease: "Sine.Out",
            });
            this.setDepth(0);
            return;
          case "removed":
          case "destroyed":
            this.remove();
            break;
        }
        this.setDepth(Math.floor(this.y / CELL_SIZE));
        this.shadow.setDepth(Math.floor(this.y / CELL_SIZE) - 1);
      }
    );

    this.scene.events.once("clear", this.remove, this);
  }

  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.scene.events.removeListener(this.id);
    this.shadow.destroy();
    this.destroy();
  }
}
