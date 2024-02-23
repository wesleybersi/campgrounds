import { STROKE_COLOR } from "../../scenes/Main/constants";
import { getAngleOffset, randomNumInRange } from "../../utils/helper-functions";
import { Player } from "../Player/player";

export class Spear extends Phaser.GameObjects.Container {
  key: string;
  player: Player;
  xOffset = 0;
  yOffset = 0;

  center: Phaser.GameObjects.Rectangle;
  base: Phaser.GameObjects.Rectangle;
  tip: Phaser.GameObjects.Triangle;
  constructor(player: Player, key: string, size: number) {
    super(player.scene);
    this.player = player;

    this.center = this.scene.add.rectangle(0, 0, 28, 28, 0xff0000);
    this.center.setAlpha(0);

    this.base = this.scene.add.rectangle(0, 0, 22, size, 0x937162);
    this.base.setStrokeStyle(6, STROKE_COLOR);

    //ANCHOR Pointy Tip
    const tipWidth = 38;
    const tipHeight = 70;

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
    this.tip.x = this.base.x + tipWidth / 2;
    this.tip.y = -size / 2;
    this.tip.setDepth(2);

    this.add([this.base, this.center, this.tip]);

    this.key = key;
    this.scene.add.existing(this);

    this.scene.events.once("clear", this.remove, this);
  }
  update(x: number, y: number, angle: number, force: number) {
    // Set the angle, depth, origin, and position as you did before

    angle += 90;
    const distance = 70;
    const { x: newX, y: newY } = getAngleOffset(x, y, angle, distance);

    this.setAngle(angle);
    this.setPosition(newX, newY);

    this.player.leftHand.setPosition(55, 70);
    this.player.rightHand.setPosition(-18, 70);
  }

  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.destroy();
  }

  attack() {
    const distance = 64;
    const { x, y } = getAngleOffset(this.x, this.y, this.angle - 90, distance);

    const xOffset = x - this.x;
    const yOffset = y - this.y;
    this.scene.tweens.add({
      targets: [this],
      xOffset,
      yOffset,
      duration: 125,
      ease: "Sine.Out",
      yoyo: true,
      repeat: 0,
      onUpdate: () => {
        this.x += this.xOffset;
        this.y += this.yOffset;

        this.player.leftHand.x += Math.abs(this.xOffset);
        this.player.rightHand.x += Math.abs(this.xOffset);
      },
      onComplete: () => {
        this.xOffset = 0;
        this.yOffset = 0;
      },
    });
    // const { x: emitX, y: emitY } = getAngleOffset(
    //   this.x,
    //   this.y,
    //   this.angle - 90,
    //   40
    // );
    // this.player.scene.emitter.emitImpact(emitX, emitY);
  }
  hold(force: number) {
    const distance = 10;
    const { x, y } = getAngleOffset(this.x, this.y, this.angle + 90, distance);

    const xOffset = x - this.x;
    const yOffset = y - this.y;

    this.x += xOffset * force;
    this.y += yOffset * force;
  }
}
