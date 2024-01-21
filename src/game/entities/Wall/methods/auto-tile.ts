import { Wall } from "../wall";

export function autoTile(this: Wall, walls: Map<string, Wall>) {
  const adjacentToTileIndex = (
    top: boolean,
    bottom: boolean,
    left: boolean,
    right: boolean
  ): number => {
    if (right && !left && !top && !bottom) return 1;
    else if (!right && left && !top && !bottom) return 2;
    else if (!right && !left && !top && bottom) return 3;
    else if (!right && !left && top && !bottom) return 4;
    else if (!right && !left && top && bottom) return 5;
    else if (right && left && !top && !bottom) return 6;
    else if (right && !left && !top && bottom) return 7;
    else if (right && !left && top && !bottom) return 9;
    else if (!right && left && !top && bottom) return 8;
    else if (!right && left && top && !bottom) return 10;
    else if (right && left && top && !bottom) return 13;
    else if (right && left && !top && bottom) return 14;
    else if (!right && left && top && bottom) return 12;
    else if (right && !left && top && bottom) return 11;
    else if (right && left && top && bottom) {
      this.isSurrounded = true;
      return 15;
    } else return 0;
  };

  const { row, col } = this;
  const top = walls.get(`${row - 1},${col}`);
  const bottom = walls.get(`${row + 1},${col}`);
  const left = walls.get(`${row},${col - 1}`);
  const right = walls.get(`${row},${col + 1}`);

  if (
    this.row !== this.scene.rowCount - 1 &&
    (!bottom || bottom.size !== this.size)
  ) {
    this.bottomIsFree = true;
  }

  this.setFrame(
    adjacentToTileIndex(
      this.row === 0 || (top && top.size === this.size) ? true : false,
      this.row === this.scene.rowCount - 1 ||
        (bottom && bottom.size === this.size)
        ? true
        : false,
      this.col === 0 || (left && left.size === this.size) ? true : false,
      this.col === this.scene.colCount - 1 ||
        (right && right.size === this.size)
        ? true
        : false
    )
  );
}
