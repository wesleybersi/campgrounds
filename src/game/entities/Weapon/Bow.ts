import { getAngleOffset } from "../../utils/helper-functions";
import { Player } from "../Player/player";

export class Bow extends Phaser.GameObjects.Sprite {
  key: string;
  player: Player;

  constructor(player: Player, key: string) {
    super(player.scene, 0, 0, "bow");
    this.player = player;
    this.key = key;
    this.setScale(1);

    // this.player.add(this);
    this.scene.add.existing(this);

    this.scene.events.once("clear", this.remove, this);

    switch (key) {
      case "bow-long":
        this.setScale(1.2);
        break;
      case "bow-short":
        this.setScale(0.65);
        break;
      default:
        this.setScale(1);
        break;
    }
  }
  attack() {}
  update(x: number, y: number, angle: number, force: number) {
    const distance = this.key.includes("short") ? 42 : 32;
    const { x: newX, y: newY } = getAngleOffset(x, y, angle, distance);
    this.setAngle(angle);

    this.setOrigin(0.5);
    this.setPosition(newX, newY);

    //ANCHOR Hands
    this.player.leftHand.setPosition(105, -12);
    if (force) {
      this.player.rightHand.x = 105 - force * 50;
      this.player.rightHand.y = 12 + force * 16;
    } else {
      const x = 105;
      const y = 12;
      // this.player.rightHand.setPosition(105, 12);
      if (this.player.rightHand.x !== x)
        this.scene.tweens.add({
          targets: this.player.rightHand,
          duration: 75,
          x,
          y,
          ease: "Sine.Out",
        });
    }
  }
  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.destroy();
  }
}
