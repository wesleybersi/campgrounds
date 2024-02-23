import { getAngleOffset, randomNumInRange } from "../../utils/helper-functions";
import { Player } from "../Player/player";

export class Sword extends Phaser.GameObjects.Sprite {
  key: string;
  player: Player;
  angleOffset = 90;
  isAttacking = false;

  constructor(player: Player, key: string) {
    super(player.scene, 0.5, 0.5, "sword");
    this.player = player;
    this.key = key;
    this.setScale(9);
    this.scene.add.existing(this);

    this.scene.events.once("clear", this.remove, this);
  }
  update(x: number, y: number, angle: number, force: number) {
    // Set the angle, depth, origin, and position as you did before
    // if (this.isAttacking) {
    //   this.setScale(0.7);
    //   this.setAlpha(1);
    // } else {
    //   this.setScale(0.5);
    //   this.setAlpha(0);
    // }

    angle += this.angleOffset;

    const distance = this.isAttacking ? 80 : 80;

    const { x: newX, y: newY } = getAngleOffset(x, y, angle, distance);

    this.setAngle(angle);

    this.setOrigin(0.5, 0.825);
    this.setPosition(newX, newY + 2);

    // if (!this.isAttacking) {
    this.player.leftHand.setPosition(95, -24);
    this.player.rightHand.setPosition(95, 24);
    // }
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

    this.scene.tweens.add({
      targets: [this],
      angleOffset: -110,
      duration: 200,
      ease: "Sine.Out",
      yoyo: true,
      onUpdate: () => {
        this.player.angle += this.angleOffset - 90;
      },
      onStart: () => {
        this.isAttacking = true;
      },
      onComplete: () => {
        this.angleOffset = 90;
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
