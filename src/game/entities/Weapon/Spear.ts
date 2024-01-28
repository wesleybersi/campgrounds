import { getAngleOffset, randomNumInRange } from "../../utils/helper-functions";
import { Player } from "../Player/player";

export class Spear extends Phaser.GameObjects.Sprite {
  type = "Spear";
  player: Player;
  xOffset = 0;
  yOffset = 0;

  constructor(player: Player, tier: string) {
    super(player.scene, 0.5, 0.5, "spears");
    this.player = player;
    this.setScale(0.8);
    this.scene.add.existing(this);

    this.scene.events.once("clear", this.remove, this);
  }
  update(x: number, y: number, angle: number, depth: number) {
    // Set the angle, depth, origin, and position as you did before

    angle += 90;
    const distance = 4;
    const { x: newX, y: newY } = getAngleOffset(x, y, angle, distance);

    this.setAngle(angle);
    this.setDepth(depth);
    this.setOrigin(0.5, 0.5);
    this.setPosition(newX, newY);
  }

  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.destroy();
  }
  load() {
    this.setFrame(0);
  }

  attack() {
    const distance = 10;
    const { x, y } = getAngleOffset(this.x, this.y, this.angle - 90, distance);

    const xOffset = x - this.x;
    const yOffset = y - this.y;

    this.scene.tweens.add({
      targets: [this],
      xOffset,
      yOffset,
      duration: 80,
      ease: "Sine.InOut",
      yoyo: true,
      repeat: 0,
      onUpdate: () => {
        this.x += this.xOffset;
        this.y += this.yOffset;
      },
      onComplete: () => {
        this.xOffset = 0;
        this.yOffset = 0;
      },
    });
    const { x: emitX, y: emitY } = getAngleOffset(
      this.x,
      this.y,
      this.angle - 90,
      40
    );
    this.player.scene.emitter.emitImpact(emitX, emitY);
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
