import { Player } from "../Player/player";

export class Crossbow extends Phaser.GameObjects.Sprite {
  type = "Crossbow";
  player: Player;
  constructor(player: Player, tier: string) {
    super(player.scene, 0.5, 0.5, "crossbow");
    this.player = player;
    this.setScale(0.075);
    this.scene.add.existing(this);

    this.scene.events.once("clear", this.remove, this);
  }
  update(x: number, y: number, angle: number, depth: number) {
    this.setAngle(angle);
    this.setDepth(depth);
    this.setOrigin(0.35, 0.35);
    this.setPosition(x, y);
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
