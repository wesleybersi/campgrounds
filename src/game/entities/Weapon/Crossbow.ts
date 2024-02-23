import { getAngleOffset } from "../../utils/helper-functions";
import { Player } from "../Player/player";

export class Crossbow extends Phaser.GameObjects.Sprite {
  key: string;
  player: Player;
  constructor(player: Player, key: string) {
    super(player.scene, 0.5, 0.5, "crossbow");
    this.player = player;
    this.key = key;
    this.setScale(0.8);
    this.scene.add.existing(this);

    this.scene.events.once("clear", this.remove, this);
  }
  update(x: number, y: number, angle: number) {
    const offset = 32;
    const { x: newX, y: newY } = getAngleOffset(x, y, angle, offset);
    this.setAngle(angle);
    this.setOrigin(0.35);
    this.setPosition(newX, newY);
  }
  attack() {}
  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.destroy();
  }
  load() {
    this.setFrame(0);
  }
  unload() {
    this.setFrame(1);
  }
}
