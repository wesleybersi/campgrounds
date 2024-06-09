import { getRandomInt, oneIn } from "../../../../../../utils/helper-functions";
import { CELL_SIZE } from "../../../../constants";
import { Resource } from "../../../Staff/entities/Resource/Resource";

import { Grid } from "../../Grid";

export class Rock extends Phaser.GameObjects.Image {
  grid: Grid;
  col: number;
  row: number;
  resources = getRandomInt(1, 4);
  markedForHarvest = false;
  harvestMultiplier = 0.1; // TODO Depends on size
  constructor(grid: Grid, col: number, row: number) {
    super(
      grid.scene,
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      "rock-" + getRandomInt(1, 8).toString()
    );
    this.grid = grid;
    this.col = col;
    this.row = row;
    this.grid.collisionMap[row][col] = 1;
    this.grid.objectMatrix[row][col] = this;
    this.setDepth(this.y);
    this.grid.scene.add.existing(this);
  }

  harvest() {
    const surroundings = this.grid.getSurroundings(this.col, this.row);

    for (const [key, { col, row }] of Object.entries(surroundings)) {
      const objInPlace = this.grid.objectMatrix[row][col];
      if (objInPlace) continue;
      if (oneIn(3)) {
        new Resource(this.grid.scene, "stone", getRandomInt(1, 4), col, row);
        //TODO Make it make sense
      }
    }
    new Resource(
      this.grid.scene,
      "stone",
      getRandomInt(1, 4),
      this.col,
      this.row
    );

    return this.resources;
  }
  remove() {
    this.grid.collisionMap[this.row][this.col] = 0;
    this.grid.objectMatrix[this.row][this.col] = null;
    this.destroy();
  }
}
