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
      2
    );
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.createAnimations();
    this.setOrigin(0.5, 0.5);
    this.setDepth(2);
    this.scene.add.existing(this);
    this.scene.spikesByPos.set(`${row},${col}`, this);
    this.update(initialState);

    this.scene.events.on("clear", () => {
      this.remove();
    });
  }
  update(state: "on" | "off") {
    this.anims.play(`turn-${state}`);
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
    this.destroy();
  }
}
