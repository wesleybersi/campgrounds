import { CELL_SIZE } from "../../../../constants";
import { Grid } from "../../Grid";

export class Hedge extends Phaser.GameObjects.Image {
  grid: Grid;
  col: number;
  row: number;
  constructor(grid: Grid, col: number, row: number) {
    super(
      grid.scene,
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      "hedge",
      78
    );
    this.grid = grid;
    this.row = row;
    this.col = col;
    this.grid.collisionMap[row][col] = 1;
    this.grid.objectMatrix[row][col] = this;
    this.setDepth(this.y);
    this.grid.scene.add.existing(this);

    const surroundings = this.getSurroundings(this.col, this.row);
    for (const [key, { row, col }] of Object.entries(surroundings)) {
      const hedgeInPlace = this.grid.objectMatrix[row][col];
      if (hedgeInPlace instanceof Hedge) {
        hedgeInPlace.autoTile();
      }
    }
    this.autoTile();
  }
  remove() {
    this.grid.collisionMap[this.row][this.col] = 0;
    this.grid.objectMatrix[this.row][this.col] = null;

    const surroundings = this.getSurroundings(this.col, this.row);
    for (const [key, { row, col }] of Object.entries(surroundings)) {
      const hedgeInPlace = this.grid.objectMatrix[row][col];
      if (hedgeInPlace instanceof Hedge) {
        hedgeInPlace.autoTile();
      }
    }

    this.destroy();
  }

  getSurroundings(
    col: number,
    row: number
  ): { [key: string]: { col: number; row: number } } {
    const surroundings = {
      bottomLeft: { row: row + 1, col: col - 1 },
      bottom: { row: row + 1, col: col },
      bottomRight: { row: row + 1, col: col + 1 },
      left: { row: row, col: col - 1 },
      right: { row: row, col: col + 1 },
      topLeft: { row: row - 1, col: col - 1 },
      top: { row: row - 1, col: col },
      topRight: { row: row - 1, col: col + 1 },
    };

    return surroundings;
  }
  autoTile() {
    const surroundings = this.getSurroundings(this.col, this.row);
    const top = surroundings.top
      ? this.grid.objectMatrix[surroundings.top.row][
          surroundings.top.col
        ] instanceof Hedge
      : false;
    const bottom = surroundings.bottom
      ? this.grid.objectMatrix[surroundings.bottom.row][
          surroundings.bottom.col
        ] instanceof Hedge
      : false;
    const left = surroundings.left
      ? this.grid.objectMatrix[surroundings.left.row][
          surroundings.left.col
        ] instanceof Hedge
      : false;
    const right = surroundings.right
      ? this.grid.objectMatrix[surroundings.right.row][
          surroundings.right.col
        ] instanceof Hedge
      : false;

    const adjacentToTileIndex = (
      top: boolean,
      bottom: boolean,
      left: boolean,
      right: boolean
    ): number => {
      if (right && !left && !top && !bottom) return 1;
      else if (!right && left && !top && !bottom) {
        return 3;
      } else if (!right && !left && !top && bottom) return 32;
      else if (!right && !left && top && !bottom) return 96;
      else if (!right && !left && top && bottom) {
        return 64;
      } else if (right && left && !top && !bottom) {
        return 2;
      } else if (right && !left && !top && bottom) {
        return 33;
      } else if (right && !left && top && !bottom) {
        return 97;
      } else if (!right && left && !top && bottom) {
        return 35;
      } else if (!right && left && top && !bottom) {
        return 99;
      } else if (right && left && top && !bottom) {
        return 321;
      } else if (right && left && !top && bottom) {
        return 257;
      } else if (!right && left && top && bottom) {
        return 290;
      } else if (right && !left && top && bottom) {
        return 288;
      } else if (right && left && top && bottom) {
        return 289;
      } else {
        return 78;
      }
    };

    this.setFrame(adjacentToTileIndex(top, bottom, left, right));
  }
}
