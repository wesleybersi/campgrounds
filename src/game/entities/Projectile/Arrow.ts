import { CELL_SIZE } from "../../../../../../socket-shooter 2/server/src/constants";
import MainScene from "../../scenes/Main/MainScene";
import { SHADOW_X, SHADOW_Y } from "../../scenes/Main/constants";

export class Arrow extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  id: number;
  firstImpact = false;
  shadow: Phaser.GameObjects.Sprite;
  constructor(
    scene: MainScene,
    id: number,
    x: number,
    y: number,
    angle: number
  ) {
    super(scene, x, y, "arrow", 0);
    this.scene = scene;
    this.id = id;
    this.setAngle(angle);
    this.setScale(0.75);
    this.setOrigin(0.75, 0.5);

    this.shadow = this.scene.add.sprite(this.x, this.y, "arrow", 0);
    this.shadow.setScale(0.1);
    this.shadow.setTint(0x222222);
    this.shadow.setOrigin(0.75, 0.5);
    this.shadow.setAlpha(0.5);
    this.shadow.setDepth(0);
    scene.add.existing(this.shadow);

    scene.projectilesById.set(this.id, this);
    scene.add.existing(this);
  }
  update(
    state: string,
    x: number,
    y: number,
    z: number,
    angle: number,
    velocity: number
  ) {
    this.setPosition(x, y);
    this.setAngle(angle);

    this.shadow.setPosition(x + SHADOW_X, y + SHADOW_Y);
    this.shadow.setAngle(angle);

    switch (state) {
      case "Holding":
        this.setDepth(2);
        this.shadow.setAlpha(0);
        break;
      case "Active":
        if (velocity < 250 && this.scale > 0.5) {
          this.scale -= 0.005;
          this.shadow.scale -= 0.005;
          this.shadow.alpha -= 0.005;
          this.setDepth(10);
        }
        this.setDepth(2);
        break;
      case "HitTarget":
        if (!this.firstImpact) {
          this.scene.emitter.emitBlood(this.x, this.y);
          this.setScale(0.75);
          this.setAlpha(1);
          this.setDepth(1);

          this.shadow.setScale(0.75);
          this.shadow.setAlpha(1);
          this.shadow.setDepth(0);

          this.firstImpact = true;
        }
        break;
      case "HitTile":
      case "HitWall":
        this.setScale(0.75);
        this.setAlpha(1);
        this.setDepth(1);
        break;
      case "OnGround":
        this.scene.tweens.add({
          targets: this,
          scale: 0.5,
          // y: velocity === 0 ? this.y + 32 : this.y,
          duration: 175,
          ease: "Sine.Out",
        });
        this.scene.tweens.add({
          targets: this.shadow,
          scale: 0.5,
          alpha: 0,
          // y: velocity === 0 ? this.y + 32 : this.y,
          duration: 175,
          ease: "Sine.Out",
        });
        this.setDepth(0);
        return;
      case "Inactive":
      case "Destroyed":
        this.remove();
        break;
    }
    this.setDepth(Math.floor(this.y / CELL_SIZE));
    this.shadow.setDepth(Math.floor(this.y / CELL_SIZE) - 1);
  }
  remove() {
    this.scene.projectilesById.delete(this.id);
    this.shadow.destroy();
    this.destroy();
  }
}
