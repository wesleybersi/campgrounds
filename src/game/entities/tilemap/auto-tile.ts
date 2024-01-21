import { generateRandomColor } from "../../utils/helper-functions";

export default function autoTile(
  tile: Phaser.Tilemaps.Tile,
  walls: Phaser.Tilemaps.TilemapLayer
) {
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
    else if (right && left && top && bottom) return 15;
    else return 0;
  };

  if (tile.properties.slope) {
    switch (tile.properties.slope) {
      case "tr":
        tile.index = 18;
        return;
      case "tl":
        tile.index = 19;
        return;
      case "bl":
        tile.index = 17;
        return;
      case "br":
        tile.index = 16;
        return;
    }
  }

  const top = walls.getTileAt(tile.x, tile.y - 1);
  const bottom = walls.getTileAt(tile.x, tile.y + 1);
  const left = walls.getTileAt(tile.x - 1, tile.y);
  const right = walls.getTileAt(tile.x + 1, tile.y);

  tile.index = adjacentToTileIndex(
    top && top.properties.isWall,
    bottom && bottom.properties.isWall,
    left && left.properties.isWall,
    right && right.properties.isWall
  );
}
