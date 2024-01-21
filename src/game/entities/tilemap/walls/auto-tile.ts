export function autoTile(tile: Phaser.Tilemaps.Tile, matrix: string[][]) {
  const adjacentToTileIndex = (
    top: boolean,
    bottom: boolean,
    left: boolean,
    right: boolean
  ): number => {
    if (right && !left && !top && !bottom) return 10;
    else if (!right && left && !top && !bottom) return 9;
    else if (!right && !left && !top && bottom) return 17;
    else if (!right && !left && top && !bottom) return 26;
    else if (!right && !left && top && bottom) return 16;
    else if (right && left && !top && !bottom) return 2;
    else if (right && !left && !top && bottom) return 0;
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
      return -1;
    } else return 12;
  };

  const { x, y } = tile;
  const top = matrix[y - 1] && matrix[y - 1][x] === "wall";
  const bottom = matrix[y + 1] && matrix[y + 1][x] === "wall";
  const left = matrix[y] && matrix[y][x - 1] && matrix[y][x - 1] === "wall";
  const right = matrix[y] && matrix[y][x + 1] && matrix[y][x + 1] === "wall";

  return adjacentToTileIndex(top, bottom, left, right);
}
