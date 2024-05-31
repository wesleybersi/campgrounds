import MainScene from "../../../../../MainScene";
import { CELL_SIZE } from "../../../../../constants";
import { Wall } from "../../../../Grid/entities/Wall/Wall";
import { Task } from "../../../entities/Task/Task";
import { Builder } from "../Builder";

//Task types
//Harvesting - Building - Carrying

export class Blueprint extends Task {
  graphic: Phaser.GameObjects.Rectangle;
  col: number;
  row: number;
  type: "wall";
  tier: "wood" | "hedge";
  price: number;
  constructor(
    scene: MainScene,
    type: "wall",
    tier: "wood" | "hedge",
    price: 25,
    col: number,
    row: number
  ) {
    super(
      scene,
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      0.1,
      () => {
        console.log("Building complete");
        new Wall(this.scene.grid, this.tier, this.col, this.row);
        this.graphic.destroy();

        const set = this.scene.grid.tracker[this.row][this.col];
        for (const agent of set) {
          if (agent instanceof Builder) {
            agent.findEmptyCell();
          }
        }
      }
    );
    this.graphic = this.scene.add.rectangle(
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE,
      CELL_SIZE
    );
    this.graphic.setStrokeStyle(CELL_SIZE / 8, 0x0044ff);
    this.graphic.setDepth(20);

    this.col = col;
    this.row = row;
    this.type = type;
    this.tier = tier;
    this.price = 25;

    this.scene.grid.objectMatrix[row][col] = this;
  }
}
