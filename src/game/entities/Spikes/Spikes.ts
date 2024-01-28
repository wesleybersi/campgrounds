import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT } from "../../scenes/Main/constants";

export class Spikes extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  row: number;
  col: number;
  constructor(
    scene: MainScene,
    initialState: "on" | "off",
    row: number,
    col: number
  ) {
    super(
      scene,
      col * CELL_HEIGHT + CELL_HEIGHT / 2,
      row * CELL_HEIGHT + CELL_HEIGHT / 2,
      "spikes",
      initialState === "on" ? 2 : 6
    );
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.createAnimations();
    this.setOrigin(0.5, 0.5);
    this.setDepth(2);
    this.scene.add.existing(this);

    this.scene.events.on(
      `spikes-${row}-${col}`,
      (type: "turn-on" | "turn-off") => {
        switch (type) {
          case "turn-on":
            this.anims.play(type);
            break;
          case "turn-off":
            this.anims.play(type);
            break;
        }
      }
    );

    this.scene.events.once("clear", this.remove, this);
  }

  createAnimations() {
    this.anims.create({
      key: "turn-off",
      frames: this.anims.generateFrameNumbers("spikes", {
        start: 2,
        end: 6,
      }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "turn-on",
      frames: this.anims.generateFrameNumbers("spikes", {
        start: 6,
        end: 2,
      }),
      frameRate: 10,
      repeat: 0,
    });
  }

  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.scene.events.removeListener(`spikes-${this.row}-${this.col}`);
    this.destroy();
  }
}
