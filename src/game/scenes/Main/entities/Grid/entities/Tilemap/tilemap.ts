import { getRandomInt, oneIn } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";
import { CELL_SIZE } from "../../../../constants";
import { Grid } from "../../Grid";

export default class BasicTilemap {
  scene: MainScene;
  grid: Grid;
  baseMap: Phaser.Tilemaps.Tilemap;
  baseTiles!: Phaser.Tilemaps.Tileset;
  base!: Phaser.Tilemaps.TilemapLayer;

  constructor(grid: Grid, rows: number, cols: number) {
    this.scene = grid.scene as MainScene;
    this.grid = grid;
    this.baseMap = grid.scene.make.tilemap({
      tileWidth: CELL_SIZE,
      tileHeight: CELL_SIZE,
      width: cols,
      height: rows,
    });

    const baseTiles = this.baseMap.addTilesetImage("tiles");

    if (baseTiles) this.baseTiles = baseTiles;

    const baseLayer = this.baseMap.createBlankLayer(
      "Base Layer",
      this.baseTiles,
      0,
      0,
      grid.scene.colCount,
      grid.scene.rowCount,
      CELL_SIZE,
      CELL_SIZE
    );

    if (baseLayer) this.base = baseLayer;

    this.base.setDepth(0);

    this.placeInitialTiles();
    this.autoTileWater();
    this.autoTileElevation();
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
  placeConcreteTile(col: number, row: number) {
    const tile = this.base.getTileAt(col, row);
    tile.tint = 0x8e8f8a;
  }
  placeWaterTile(col: number, row: number) {
    if (!this.grid.isWithinBounds(col, row)) return;
    const tile = this.base.putTileAt(32, col, row);

    this.grid.floorMatrix[row][col] = "water";
    this.grid.collisionMap[row][col] = 1;
  }
  placeDirtTile(col: number, row: number) {
    if (!this.grid.isWithinBounds(col, row)) return;
    const tile = this.base.putTileAt(36, col, row);
    this.grid.floorMatrix[row][col] = "dirt";
  }
  placeElevationTile(col: number, row: number) {
    if (!this.grid.isWithinBounds(col, row)) return;
    const tile = this.base.putTileAt(108, col, row);
    this.grid.collisionMap[row][col] = 1;
    this.grid.floorMatrix[row][col] = "grass-elevated";
  }
  placeGrassTile(col: number, row: number) {
    if (!this.grid.isWithinBounds(col, row)) return;

    let index = 28; // empty grass tile

    if (oneIn(50)) {
      index = 163;
    }
    if (oneIn(100)) {
      index = 164;
    }
    if (oneIn(200)) {
      const deco = [162, 163, 164, 165];
      index = deco[getRandomInt(deco.length)];
    }
    const tile = this.base.putTileAt(index, col, row);

    this.grid.floorMatrix[row][col] = "grass";
  }

  placeInitialTiles() {
    this.base.forEachTile((tile) => {
      this.placeGrassTile(tile.x, tile.y);
    });

    this.grid.collisionMap.forEach((row, y) =>
      row.forEach((cell, x) => this.placeGrassTile(x, y))
    );

    const patchAmount = getRandomInt(32);
    for (let i = 0; i < patchAmount; i++) {
      const type = oneIn(2) ? "elevation" : "water";
      const initialX = getRandomInt(this.scene.colCount);
      const initialY = getRandomInt(this.scene.rowCount);

      let iterations = getRandomInt(1000);
      const iterated = new Set<string>();
      const expandPatch = (x: number, y: number) => {
        if (type === "water") this.placeWaterTile(x, y);
        else this.placeElevationTile(x, y);
        iterations--;
        if (iterations <= 0) return;
        const surroundings = [
          { x: x + 1, y },
          { x: x - 1, y },
          { x, y: y + 1 },
          { x, y: y - 1 },
        ];
        for (const side of surroundings.sort(() => Math.random() - 0.5)) {
          if (!this.grid.isWithinBounds(side.x, side.y)) continue;
          if (iterated.has(`${side.x},${side.y}`)) continue;

          iterated.add(`${side.x},${side.y}`);
          expandPatch(side.x, side.y);
        }
      };
      expandPatch(initialX, initialY);
    }
  }
  autoTileWater() {
    this.grid.floorMatrix.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell === "water") {
          const tile = this.base.getTileAt(x, y);
          const surroundings = this.getSurroundings(x, y);

          for (const [key, { col, row }] of Object.entries(surroundings)) {
            if (!this.grid.isWithinBounds(col, row)) {
              delete surroundings[key];
            }
          }

          const top = surroundings.top
            ? this.grid.floorMatrix[surroundings.top.row][
                surroundings.top.col
              ]?.startsWith("grass")
            : false;
          const bottom = surroundings.bottom
            ? this.grid.floorMatrix[surroundings.bottom.row][
                surroundings.bottom.col
              ]?.startsWith("grass")
            : false;
          const left = surroundings.left
            ? this.grid.floorMatrix[surroundings.left.row][
                surroundings.left.col
              ]?.startsWith("grass")
            : false;
          const right = surroundings.right
            ? this.grid.floorMatrix[surroundings.right.row][
                surroundings.right.col
              ]?.startsWith("grass")
            : false;

          const topLeft = surroundings.topLeft
            ? this.grid.floorMatrix[surroundings.topLeft.row][
                surroundings.topLeft.col
              ]?.startsWith("grass")
            : false;
          const topRight = surroundings.topRight
            ? this.grid.floorMatrix[surroundings.topRight.row][
                surroundings.topRight.col
              ]?.startsWith("grass")
            : false;
          const bottomLeft = surroundings.bottomLeft
            ? this.grid.floorMatrix[surroundings.bottomLeft.row][
                surroundings.bottomLeft.col
              ]?.startsWith("grass")
            : false;
          const bottomRight = surroundings.bottomRight
            ? this.grid.floorMatrix[surroundings.bottomRight.row][
                surroundings.bottomRight.col
              ]?.startsWith("grass")
            : false;

          const adjacentToTileIndex = (
            top: boolean,
            bottom: boolean,
            left: boolean,
            right: boolean,
            topLeft: boolean,
            topRight: boolean,
            bottomLeft: boolean,
            bottomRight: boolean
          ): number => {
            if (right && !left && !top && !bottom) return 33;
            else if (!right && left && !top && !bottom) {
              return 31;
            } else if (!right && !left && !top && bottom) return 59;
            else if (!right && !left && top && !bottom) return 5;
            else if (!right && !left && top && bottom) {
              return 86;
            } else if (right && left && !top && !bottom) {
              return 34;
            } else if (right && !left && !top && bottom) {
              // if (bottomRight) return 34;
              return 60;
            } else if (right && !left && top && !bottom) {
              // if (topRight) return 7;
              return 6;
            } else if (!right && left && !top && bottom) {
              // if (bottomLeft) return 26;
              return 58;
            } else if (!right && left && top && !bottom) {
              // if (topLeft) return 4;
              if (bottomRight) return 114;
              return 4;
            } else if (right && left && top && !bottom) {
              // if (topLeft && !topRight) {
              //   return 10;
              // } else if (!topLeft && topRight) {
              //   return 11;
              // } else if (topLeft && topRight) {
              //   return 12;
              // } else if (!topLeft && !topRight) {
              return 7;
              // }
            } else if (right && left && !top && bottom) {
              // if (bottomLeft && !bottomRight) {
              //   return 29;
              // } else if (!bottomLeft && bottomRight) {
              //   return 37;
              // } else if (bottomLeft && bottomRight) {
              //   return 42;
              // } else if (!bottomLeft && !bottomRight) {
              return 61;
              // }
            } else if (!right && left && top && bottom) {
              // if (topLeft && !bottomLeft) {
              //   return 17;
              // } else if (!topLeft && bottomLeft) {
              //   return 27;
              // } else if (topLeft && bottomLeft) {
              //   return 28;
              // } else if (!topLeft && !bottomLeft) {
              return 85;
              // }
            } else if (right && !left && top && bottom) {
              // if (topRight && !bottomRight) {
              //   return 20;
              // } else if (!topRight && bottomRight) {
              //   return 35;
              // } else if (topRight && bottomRight) {
              //   return 36;
              // } else if (!topRight && !bottomRight) {
              return 87;
              // }
            } else if (right && left && top && bottom) {
              //Surrounded
              // tile.tint = 0xff0000;

              if (topLeft && !bottomLeft && !topRight && !bottomRight) {
                return 140;
              } else if (!topLeft && !bottomLeft && topRight && !bottomRight) {
                // return 24;
              } else if (!topLeft && bottomLeft && !topRight && !bottomRight) {
                // return 30;
              } else if (!topLeft && !bottomLeft && !topRight && bottomRight) {
                // return 38;
              }
              // if (topLeft && bottomLeft && !topRight && !bottomRight) {
              //   return 31;
              // } else if (!topLeft && !bottomLeft && topRight && bottomRight) {
              //   return 40;
              // } else if (topLeft && !bottomLeft && topRight && !bottomRight) {
              //   return 25;
              // } else if (!topLeft && bottomLeft && !topRight && bottomRight) {
              //   return 43;
              // }
              // if (!topLeft && bottomLeft && topRight && bottomRight) {
              //   return 45;
              // } else if (topLeft && bottomLeft && !topRight && bottomRight) {
              //   return 44;
              // } else if (topLeft && !bottomLeft && topRight && bottomRight) {
              //   return 41;
              // } else if (topLeft && bottomLeft && topRight && !bottomRight) {
              //   return 33;
              // } else if (!topLeft && !topRight && !bottomLeft && !bottomRight)
              return 88;
            } else {
              //Surrounded
              if (topLeft && !bottomLeft && !topRight && !bottomRight) {
                return 140;
              } else if (!topLeft && !bottomLeft && topRight && !bottomRight) {
                return 139;
              } else if (!topLeft && bottomLeft && !topRight && !bottomRight) {
                return 113;
              } else if (!topLeft && !bottomLeft && !topRight && bottomRight) {
                return 112;
              }
              if (topLeft && bottomLeft && !topRight && !bottomRight) {
                // return 31;
              } else if (!topLeft && !bottomLeft && topRight && bottomRight) {
                // return 40;
              } else if (topLeft && !bottomLeft && topRight && !bottomRight) {
                // return 25;
              } else if (!topLeft && bottomLeft && !topRight && bottomRight) {
                // return 43;
              }
              if (!topLeft && bottomLeft && topRight && bottomRight) {
                // return 45;
              } else if (topLeft && bottomLeft && !topRight && bottomRight) {
                // return 44;
              } else if (topLeft && !bottomLeft && topRight && bottomRight) {
                // return 41;
              } else if (topLeft && bottomLeft && topRight && !bottomRight) {
                // return 33;
              } else if (!topLeft && !topRight && !bottomLeft && !bottomRight) {
                //
              }
              return oneIn(100) ? 166 : 32;
            }
          };
          tile.index = adjacentToTileIndex(
            top ?? false,
            bottom ?? false,
            left ?? false,
            right ?? false,
            topLeft ?? false,
            topRight ?? false,
            bottomLeft ?? false,
            bottomRight ?? false
          );
        }
      })
    );
  }
  autoTileElevation() {
    this.base.forEachTile((tile) => {
      if (this.grid.floorMatrix[tile.y][tile.x] === "grass-elevated") {
        this.grid.collisionMap[tile.y][tile.x] = 1;
        const surroundings = this.getSurroundings(tile.x, tile.y);
        for (const [key, surrounding] of Object.entries(surroundings)) {
          if (this.grid.isWithinBounds(surrounding.col, surrounding.row))
            continue;
          delete surroundings[key];
        }

        const top = surroundings.top
          ? this.grid.floorMatrix[surroundings.top.row][
              surroundings.top.col
            ] !== "grass-elevated"
          : false;
        const bottom = surroundings.bottom
          ? this.grid.floorMatrix[surroundings.bottom.row][
              surroundings.bottom.col
            ] !== "grass-elevated"
          : false;
        const left = surroundings.left
          ? this.grid.floorMatrix[surroundings.left.row][
              surroundings.left.col
            ] !== "grass-elevated"
          : false;
        const right = surroundings.right
          ? this.grid.floorMatrix[surroundings.right.row][
              surroundings.right.col
            ] !== "grass-elevated"
          : false;

        const topLeft = surroundings.topLeft
          ? this.grid.floorMatrix[surroundings.topLeft.row][
              surroundings.topLeft.col
            ] !== "grass-elevated"
          : false;
        const topRight = surroundings.topRight
          ? this.grid.floorMatrix[surroundings.topRight.row][
              surroundings.topRight.col
            ] !== "grass-elevated"
          : false;
        const bottomLeft = surroundings.bottomLeft
          ? this.grid.floorMatrix[surroundings.bottomLeft.row][
              surroundings.bottomLeft.col
            ] !== "grass-elevated"
          : false;
        const bottomRight = surroundings.bottomRight
          ? this.grid.floorMatrix[surroundings.bottomRight.row][
              surroundings.bottomRight.col
            ] !== "grass-elevated"
          : false;

        const adjacentToTileIndex = (
          top: boolean,
          bottom: boolean,
          left: boolean,
          right: boolean,
          topLeft: boolean,
          topRight: boolean,
          bottomLeft: boolean,
          bottomRight: boolean
        ): number => {
          if (right && !left && !top && !bottom) return 29;
          else if (!right && left && !top && !bottom) {
            return 27;
          } else if (!right && !left && !top && bottom) return 55;
          else if (!right && !left && top && !bottom) return 1;
          else if (!right && !left && top && bottom) {
            return 82;
          } else if (right && left && !top && !bottom) {
            return 30;
          } else if (right && !left && !top && bottom) {
            // if (bottomRight) return 34;
            return 56;
          } else if (right && !left && top && !bottom) {
            // if (topRight) return 7;
            return 2;
          } else if (!right && left && !top && bottom) {
            // if (bottomLeft) return 26;
            return 54;
          } else if (!right && left && top && !bottom) {
            // if (topLeft) return 4;
            if (bottomRight) return 110;
            return 0;
          } else if (right && left && top && !bottom) {
            // if (topLeft && !topRight) {
            //   return 10;
            // } else if (!topLeft && topRight) {
            //   return 11;
            // } else if (topLeft && topRight) {
            //   return 12;
            // } else if (!topLeft && !topRight) {
            return 3;
            // }
          } else if (right && left && !top && bottom) {
            // if (bottomLeft && !bottomRight) {
            //   return 29;
            // } else if (!bottomLeft && bottomRight) {
            //   return 37;
            // } else if (bottomLeft && bottomRight) {
            //   return 42;
            // } else if (!bottomLeft && !bottomRight) {
            return 67;
            // }
          } else if (!right && left && top && bottom) {
            // if (topLeft && !bottomLeft) {
            //   return 17;
            // } else if (!topLeft && bottomLeft) {
            //   return 27;
            // } else if (topLeft && bottomLeft) {
            //   return 28;
            // } else if (!topLeft && !bottomLeft) {
            return 81;
            // }
          } else if (right && !left && top && bottom) {
            // if (topRight && !bottomRight) {
            //   return 20;
            // } else if (!topRight && bottomRight) {
            //   return 35;
            // } else if (topRight && bottomRight) {
            //   return 36;
            // } else if (!topRight && !bottomRight) {
            return 83;
            // }
          } else if (right && left && top && bottom) {
            //Surrounded

            if (topLeft && !bottomLeft && !topRight && !bottomRight) {
              return 136;
            } else if (!topLeft && !bottomLeft && topRight && !bottomRight) {
              // return 24;
            } else if (!topLeft && bottomLeft && !topRight && !bottomRight) {
              // return 30;
            } else if (!topLeft && !bottomLeft && !topRight && bottomRight) {
              // return 38;
            }
            // if (topLeft && bottomLeft && !topRight && !bottomRight) {
            //   return 31;
            // } else if (!topLeft && !bottomLeft && topRight && bottomRight) {
            //   return 40;
            // } else if (topLeft && !bottomLeft && topRight && !bottomRight) {
            //   return 25;
            // } else if (!topLeft && bottomLeft && !topRight && bottomRight) {
            //   return 43;
            // }
            // if (!topLeft && bottomLeft && topRight && bottomRight) {
            //   return 45;
            // } else if (topLeft && bottomLeft && !topRight && bottomRight) {
            //   return 44;
            // } else if (topLeft && !bottomLeft && topRight && bottomRight) {
            //   return 41;
            // } else if (topLeft && bottomLeft && topRight && !bottomRight) {
            //   return 33;
            // } else if (!topLeft && !topRight && !bottomLeft && !bottomRight)
            return 84;
          } else {
            this.grid.collisionMap[tile.y][tile.x] = 0;
            //Surrounded
            if (topLeft && !bottomLeft && !topRight && !bottomRight) {
              return 136;
            } else if (!topLeft && !bottomLeft && topRight && !bottomRight) {
              return 135;
            } else if (!topLeft && bottomLeft && !topRight && !bottomRight) {
              return 109;
            } else if (!topLeft && !bottomLeft && !topRight && bottomRight) {
              return 108;
            }
            if (topLeft && bottomLeft && !topRight && !bottomRight) {
              // return 31;
            } else if (!topLeft && !bottomLeft && topRight && bottomRight) {
              // return 40;
            } else if (topLeft && !bottomLeft && topRight && !bottomRight) {
              // return 25;
            } else if (!topLeft && bottomLeft && !topRight && bottomRight) {
              // return 43;
            }
            if (!topLeft && bottomLeft && topRight && bottomRight) {
              // return 45;
            } else if (topLeft && bottomLeft && !topRight && bottomRight) {
              // return 44;
            } else if (topLeft && !bottomLeft && topRight && bottomRight) {
              // return 41;
            } else if (topLeft && bottomLeft && topRight && !bottomRight) {
              // return 33;
            } else if (!topLeft && !topRight && !bottomLeft && !bottomRight) {
              //
            }

            return 28;
          }
        };

        tile.index = adjacentToTileIndex(
          top,
          bottom,
          left,
          right,
          topLeft,
          topRight,
          bottomLeft,
          bottomRight
        );
      }
    });
  }
}
