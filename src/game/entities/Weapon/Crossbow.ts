import { Player } from "../Player/player";

export class Crossbow extends Phaser.GameObjects.Sprite {
  type = "Crossbow";
  player: Player;
  constructor(player: Player, tier: string) {
    super(player.scene, 0, 0, "crossbow");
    this.player = player;
    this.setScale(0.1);

    this.scene.events.on("clear", () => {
      this.remove();
    });
  }
  remove() {
    this.destroy();
  }
  load() {
    this.setFrame(0);
  }
  unload() {
    this.setFrame(1);
  }
}
