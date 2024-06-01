import MainScene from "../../../../../MainScene";
import { oneIn } from "../../../../../../../utils/helper-functions";

export function autoTile(
  tile: Phaser.Tilemaps.Tile,
  matrix: string[][],
  isCracked?: boolean
) {
  const isValidCell = (y: number, x: number) => {
    if (matrix[y] && matrix[y][x]) return true;
    return false;
  };
  const isWallCell = (y: number, x: number) => {
    if (matrix[y][x].includes("wall")) return true;
    return false;
  };

  const adjacentToTileIndex = (
    top: boolean,
    bottom: boolean,
    left: boolean,
    right: boolean
  ): number => {
    if (right && !left && !top && !bottom) return 5;
    else if (!right && left && !top && !bottom) {
      return 2;
    } else if (!right && !left && !top && bottom) return 13;
    else if (!right && !left && top && !bottom) return 1;
    else if (!right && !left && top && bottom) {
      return 14;
    } else if (right && left && !top && !bottom) {
      return 8;
    } else if (right && !left && !top && bottom) {
      const bottomRight = isValidCell(y + 1, x + 1) && isWallCell(y + 1, x + 1);
      if (bottomRight) return 34;
      return 18;
    } else if (right && !left && top && !bottom) {
      const topRight = isValidCell(y - 1, x + 1) && isWallCell(y - 1, x + 1);
      if (topRight) return 7;
      return 6;
    } else if (!right && left && !top && bottom) {
      const bottomLeft = isValidCell(y + 1, x - 1) && isWallCell(y + 1, x - 1);
      if (bottomLeft) return 26;
      return 15;
    } else if (!right && left && top && !bottom) {
      const topLeft = isValidCell(y - 1, x - 1) && isWallCell(y - 1, x - 1);
      if (topLeft) return 4;
      return 3;
    } else if (right && left && top && !bottom) {
      const topLeft = isValidCell(y - 1, x - 1) && isWallCell(y - 1, x - 1);
      const topRight = isValidCell(y - 1, x + 1) && isWallCell(y - 1, x + 1);
      if (topLeft && !topRight) {
        return 10;
      } else if (!topLeft && topRight) {
        return 11;
      } else if (topLeft && topRight) {
        return 12;
      } else if (!topLeft && !topRight) {
        return 9;
      }
    } else if (right && left && !top && bottom) {
      const bottomLeft = isValidCell(y + 1, x - 1) && isWallCell(y + 1, x - 1);
      const bottomRight = isValidCell(y + 1, x + 1) && isWallCell(y + 1, x + 1);

      if (bottomLeft && !bottomRight) {
        return 29;
      } else if (!bottomLeft && bottomRight) {
        return 37;
      } else if (bottomLeft && bottomRight) {
        return 42;
      } else if (!bottomLeft && !bottomRight) {
        return 18;
      }
    } else if (!right && left && top && bottom) {
      const topLeft = isValidCell(y - 1, x - 1) && isWallCell(y - 1, x - 1);
      const bottomLeft = isValidCell(y + 1, x - 1) && isWallCell(y + 1, x - 1);

      if (topLeft && !bottomLeft) {
        return 17;
      } else if (!topLeft && bottomLeft) {
        return 27;
      } else if (topLeft && bottomLeft) {
        return 28;
      } else if (!topLeft && !bottomLeft) {
        return 16;
      }
    } else if (right && !left && top && bottom) {
      const topRight = isValidCell(y - 1, x + 1) && isWallCell(y - 1, x + 1);
      const bottomRight = isValidCell(y + 1, x + 1) && isWallCell(y + 1, x + 1);
      if (topRight && !bottomRight) {
        return 20;
      } else if (!topRight && bottomRight) {
        return 35;
      } else if (topRight && bottomRight) {
        return 36;
      } else if (!topRight && !bottomRight) {
        return 19;
      }
    } else if (right && left && top && bottom) {
      //Surrounded
      const topLeft = isValidCell(y - 1, x - 1) && isWallCell(y - 1, x - 1);
      const bottomLeft = isValidCell(y + 1, x - 1) && isWallCell(y + 1, x - 1);
      const topRight = isValidCell(y - 1, x + 1) && isWallCell(y - 1, x + 1);
      const bottomRight = isValidCell(y + 1, x + 1) && isWallCell(y + 1, x + 1);

      if (topLeft && !bottomLeft && !topRight && !bottomRight) {
        return 23;
      } else if (!topLeft && !bottomLeft && topRight && !bottomRight) {
        return 24;
      } else if (!topLeft && bottomLeft && !topRight && !bottomRight) {
        return 30;
      } else if (!topLeft && !bottomLeft && !topRight && bottomRight) {
        return 38;
      }

      if (topLeft && bottomLeft && !topRight && !bottomRight) {
        return 31;
      } else if (!topLeft && !bottomLeft && topRight && bottomRight) {
        return 40;
      } else if (topLeft && !bottomLeft && topRight && !bottomRight) {
        return 25;
      } else if (!topLeft && bottomLeft && !topRight && bottomRight) {
        return 43;
      }

      if (!topLeft && bottomLeft && topRight && bottomRight) {
        return 45;
      } else if (topLeft && bottomLeft && !topRight && bottomRight) {
        return 44;
      } else if (topLeft && !bottomLeft && topRight && bottomRight) {
        return 41;
      } else if (topLeft && bottomLeft && topRight && !bottomRight) {
        return 33;
      } else if (!topLeft && !topRight && !bottomLeft && !bottomRight)
        return 46;
    } else return 47;
    return -1;
  };

  const { x, y } = tile;
  const top = isValidCell(y - 1, x) && isWallCell(y - 1, x);
  const bottom = isValidCell(y + 1, x) && isWallCell(y + 1, x);
  const left = isValidCell(y, x - 1) && isWallCell(y, x - 1);
  const right = isValidCell(y, x + 1) && isWallCell(y, x + 1);

  return adjacentToTileIndex(top, bottom, left, right);
}
