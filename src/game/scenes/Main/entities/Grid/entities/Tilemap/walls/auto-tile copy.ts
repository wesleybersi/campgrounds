import MainScene from "../../../../../MainScene";
import { oneIn } from "../../../../../../../utils/helper-functions";

export function autoTile(
  tile: Phaser.Tilemaps.Tile,
  matrix: string[][],
  isCracked?: boolean
) {
  const isValidCell = (x: number, y: number) => {
    if (matrix[y] && matrix[y][x]) return true;
    return false;
  };
  const isWallCell = (x: number, y: number) => {
    if (matrix[y][x].includes("wall")) return true;
    return false;
  };

  const adjacentToTileIndex = (
    top: boolean,
    bottom: boolean,
    left: boolean,
    right: boolean
  ): number => {
    if (right && !left && !top && !bottom) return 10;
    else if (!right && left && !top && !bottom) {
      return 9;
    } else if (!right && !left && !top && bottom) return 17;
    else if (!right && !left && top && !bottom) return 26;
    else if (!right && !left && top && bottom) {
      if (isCracked) {
        if (oneIn(2)) {
          return 19;
        } else {
          return 4;
        }
      }
      return 16;
    } else if (right && left && !top && !bottom) {
      if (isCracked) {
        return 20;
      }
      return 2;
    } else if (right && !left && !top && bottom) return 0;
    else if (right && !left && top && !bottom) return 24;
    else if (!right && left && !top && bottom) return 3;
    else if (!right && left && top && !bottom) return 27;
    else if (right && left && top && !bottom) return 25;
    else if (right && left && !top && bottom) return 18;
    else if (!right && left && top && bottom) return 11;
    else if (right && !left && top && bottom) return 8;
    else if (right && left && top && bottom) {
      //IS SURROUNDED
      // return 22;
      return 1;
    } else return 12;
  };

  const { x, y } = tile;
  const top = isValidCell(y - 1, x) && isWallCell(y - 1, x);
  const bottom = isValidCell(y + 1, x) && isWallCell(y + 1, x);
  const left = isValidCell(y, x - 1) && isWallCell(y, x - 1);
  const right = isValidCell(y, x + 1) && isWallCell(y, x + 1);

  return adjacentToTileIndex(top, bottom, left, right);
}
