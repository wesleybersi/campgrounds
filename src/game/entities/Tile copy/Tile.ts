import { CELL_SIZE } from "../../../../../../socket-shooter 2/server/src/constants";
import MainScene from "../../scenes/Main/MainScene";

export class Tile extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  id: number;
  constructor(
    scene: MainScene,
    type: "Crate" | "Metal Crate",
    id: number,
    x: number,
    y: number
  ) {
    super(scene, x, y - 16, "crates", type === "Crate" ? 0 : 1);

    this.scene = scene;
    this.id = id;
    this.setOrigin(0.5, 0.5);
    scene.tilesById.set(id, this);
    scene.add.existing(this);
    this.setDepth(Math.floor(this.y / CELL_SIZE));
    this.setTint(0x8a9dab);
  }
  update(x: number, y: number, hp: number) {
    this.setPosition(x, y - 16);
    this.setDepth(Math.floor(this.y / CELL_SIZE));
    if (hp <= 0) {
      this.remove();
    }
  }
  remove() {
    this.scene.emitter.emitSmoke(this.x, this.y);
    this.destroy();
  }
}
