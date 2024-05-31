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

  groundPalette = [
    0x649c43, 0x669b43, 0x679942, 0x699842, 0x6b9642, 0x6c9542, 0x6e9341,
    0x709241, 0x719041, 0x738f41, 0x748d40, 0x768c40, 0x788b40, 0x798940,
    0x7b883f, 0x7d863f, 0x7e853f, 0x80833f, 0x82823e, 0x83803e, 0x857f3e,
    0x877e3e, 0x887c3d, 0x8a7b3d, 0x8b793d, 0x8d783d, 0x8f763c, 0x90753c,
    0x92733c, 0x94723c, 0x95703b, 0x976f3b,
  ];
  waterPallete = [0x4895aa];

  constructor(grid: Grid, rows: number, cols: number) {
    this.scene = grid.scene as MainScene;
    this.grid = grid;
    this.baseMap = grid.scene.make.tilemap({
      tileWidth: CELL_SIZE,
      tileHeight: CELL_SIZE,
      width: cols,
      height: rows,
    });

    const baseTiles = this.baseMap.addTilesetImage("white-tile");
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
  }
  placeConcreteTile(col: number, row: number) {
    const tile = this.base.getTileAt(col, row);
    tile.tint = 0x8e8f8a;
  }
  placeWaterTile(col: number, row: number) {
    const tile = this.base.getTileAt(col, row);
    tile.tint = this.waterPallete[0];
  }
  placeDirtTile(col: number, row: number) {
    const tile = this.base.getTileAt(col, row);
    const randomness = getRandomInt(8, 12);
    tile.properties.wear =
      this.groundPalette[this.groundPalette.length - randomness];
    tile.tint = this.groundPalette[randomness];
  }
  placeEmptyFloorTile(col: number, row: number) {
    // const randomNess = getRandomInt(0, 7.5) / 100;
    const tile = this.base.putTileAt(0, col, row);

    tile.properties = { wear: getRandomInt(4) };
    // tile.alpha = randomNess;
    tile.tint = this.groundPalette[tile.properties.wear];

    this.scene.labour?.redirectAll();
  }

  placeInitialTiles() {
    this.base.forEachTile((tile) => {
      this.placeEmptyFloorTile(tile.x, tile.y);
    });

    this.grid.collisionMap.forEach((row, y) =>
      row.forEach((cell, x) => this.placeEmptyFloorTile(x, y))
    );

    const patchAmount = getRandomInt(32);
    for (let i = 0; i < patchAmount; i++) {
      const type = oneIn(2) ? "dirt" : "water";
      const initialX = getRandomInt(this.scene.colCount);
      const initialY = getRandomInt(this.scene.rowCount);

      let iterations = getRandomInt(768);
      const iterated = new Set<string>();
      const expandPatch = (x: number, y: number) => {
        if (type === "water") this.placeWaterTile(x, y);
        else this.placeDirtTile(x, y);
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
}
