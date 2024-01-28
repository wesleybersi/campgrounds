import { getAngleOffset, randomNumInRange } from "../../utils/helper-functions";
import { Player } from "../Player/player";

export class Sword extends Phaser.GameObjects.Sprite {
  type = "Sword";
  player: Player;
  angleOffset = 80;
  isAttacking = false;

  constructor(player: Player, tier: string) {
    super(player.scene, 0.5, 0.5, "sword");
    this.player = player;
    this.setScale(0.7);
    this.scene.add.existing(this);

    this.scene.events.once("clear", this.remove, this);
  }
  update(x: number, y: number, angle: number, depth: number) {
    // Set the angle, depth, origin, and position as you did before

    angle += this.angleOffset;

    const distance = this.isAttacking ? 14 : 14;

    const { x: newX, y: newY } = getAngleOffset(x, y, angle, distance);

    this.setAngle(angle);
    this.setDepth(depth);
    this.setOrigin(0.5, 0.5);
    this.setPosition(newX, newY + 2);
  }

  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.destroy();
  }
  load() {
    this.setFrame(0);
  }

  attack(position: string) {
    console.log(this.angleOffset);
    // let offset = 0;
    // if (position === "right") offset = 80;
    // else if (position === "left") offset = -80;

    console.log(position);

    const tween = this.scene.tweens.add({
      targets: [this],
      angleOffset: -120,
      duration: 150,
      ease: "Sine.InOut",
      yoyo: true,

      onStart: () => {
        this.isAttacking = true;
      },
      onUpdate: () => {
        if (tween.progress === 0.5) {
          const { x: emitX, y: emitY } = getAngleOffset(
            this.x,
            this.y,
            this.angle - 90,
            12
          );
          this.player.scene.emitter.emitSmoke(emitX, emitY);
        }
      },
      onComplete: () => {
        this.angleOffset = 80;
        this.isAttacking = false;
        // this.angleOffset = offset;
      },
    });
    // const { x: emitX, y: emitY } = getAngleOffset(
    //   this.x,
    //   this.y,
    //   this.angle - 90,
    //   12
    // );
    // this.player.scene.emitter.emitSmoke(emitX, emitY);
  }
  hold(force: number) {
    const distance = 10;
    const { x, y } = getAngleOffset(this.x, this.y, this.angle + 90, distance);

    const xOffset = x - this.x;
    const yOffset = y - this.y;

    this.x += xOffset * force;
    this.y += yOffset * force;
  }

  unload() {
    this.setFrame(1);
  }
}
