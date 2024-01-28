import { Wall } from "../wall";

export function autoTile(this: Wall, walls: Map<string, Wall>) {
  const adjacentToTileIndex = (
    top: boolean,
    bottom: boolean,
    left: boolean,
    right: boolean
  ): number => {
    if (right && !left && !top && !bottom) {
      this.addWallBelow();
      return 10;
    } else if (!right && left && !top && !bottom) {
      this.addWallBelow();
      return 9;
    } else if (!right && !left && !top && bottom) return 17;
    else if (!right && !left && top && !bottom) {
      this.addWallBelow();
      return 26;
    } else if (!right && !left && top && bottom) {
      // if (isCracked) {
      //   if (oneIn(2)) {
      //     return 19;
      //   } else {
      //     return 4;
      //   }
      // }
      return 16;
    } else if (right && left && !top && !bottom) {
      // if (isCracked) {
      //   return 20;
      // }
      this.addWallBelow();
      return 2;
    } else if (right && !left && !top && bottom) return 0;
    else if (right && !left && top && !bottom) {
      this.addWallBelow();
      return 24;
    } else if (!right && left && !top && bottom) return 3;
    else if (!right && left && top && !bottom) {
      this.addWallBelow();
      return 27;
    } else if (right && left && top && !bottom) {
      this.addWallBelow();
      return 25;
    } else if (right && left && !top && bottom) return 18;
    else if (!right && left && top && bottom) return 11;
    else if (right && !left && top && bottom) return 8;
    else if (right && left && top && bottom) {
      //IS SURROUNDED
      // return 22;
      return 1;
    } else {
      this.addWallBelow();
      return 12;
    }
  };

  const { row, col } = this;
  const top = walls.get(`${row - 1},${col}`);
  const bottom = walls.get(`${row + 1},${col}`);
  const left = walls.get(`${row},${col - 1}`);
  const right = walls.get(`${row},${col + 1}`);

  this.setFrame(
    adjacentToTileIndex(
      top ? true : false,
      bottom ? true : false,
      left ? true : false,
      right ? true : false
    )
  );
}
