import { CELL_HEIGHT, CELL_WIDTH } from "../../scenes/Main/constants";
import MainScene from "../../scenes/Main/MainScene";
import { oneIn, randomNum } from "../../utils/helper-functions";
import { autoTile } from "./walls/auto-tile";

export default class BasicTilemap {
  scene: MainScene;
  floorMap: Phaser.Tilemaps.Tilemap;
  wallMap: Phaser.Tilemaps.Tilemap;
  floorTiles!: Phaser.Tilemaps.Tileset;
  floor!: Phaser.Tilemaps.TilemapLayer;
  wallTiles!: Phaser.Tilemaps.Tileset;
  walls!: Phaser.Tilemaps.TilemapLayer;
  highlightedCells!: Phaser.Tilemaps.TilemapLayer;
  constructor(scene: MainScene, rows: number, cols: number) {
    this.scene = scene as MainScene;
    this.floorMap = scene.make.tilemap({
      tileWidth: CELL_WIDTH,
      tileHeight: CELL_HEIGHT,
      width: cols,
      height: rows,
    });
    this.wallMap = scene.make.tilemap({
      tileWidth: CELL_WIDTH,
      tileHeight: CELL_HEIGHT,
      width: cols,
      height: rows,
    });

    const floorTiles = this.floorMap.addTilesetImage("floor");
    if (floorTiles) this.floorTiles = floorTiles;

    const wallTiles = this.wallMap.addTilesetImage("walls");
    if (wallTiles) this.wallTiles = wallTiles;

    const floorLayer = this.floorMap.createBlankLayer(
      "Floor Layer",
      this.floorTiles,
      0,
      0,
      scene.colCount,
      scene.rowCount,
      CELL_WIDTH,
      CELL_HEIGHT
    );
    const wallLayer = this.wallMap.createBlankLayer(
      "Wall Layer",
      this.wallTiles,
      0,
      0,
      scene.colCount,
      scene.rowCount,
      CELL_WIDTH,
      CELL_HEIGHT
    );

    const highlightedCells = this.floorMap.createBlankLayer(
      "Highlighted Cells Layer",
      this.floorTiles,
      0,
      0,
      scene.colCount,
      scene.rowCount,
      CELL_WIDTH,
      CELL_HEIGHT
    );

    if (floorLayer) this.floor = floorLayer;
    if (wallLayer) this.walls = wallLayer;
    if (highlightedCells) this.highlightedCells = highlightedCells;

    // this.highlightedCells.setAlpha(0);
    this.floor.setDepth(0);
    this.walls.setDepth(1);

    this.placeInitialTiles();
  }

  placeEmptyFloorTile(col: number, row: number) {
    // const frame = randomNum(6);
    let frame = 0;
    if (oneIn(4)) {
      frame = randomNum(6);
    }
    const newTile = this.floor.putTileAt(frame, col, row);
    if (!newTile) return;

    newTile.tint = 0x798c9a;
    // newTile.alpha = 0.75;
  }

  placeWallTile(col: number, row: number) {
    const newTile = this.walls.putTileAt(-1, col, row);
    if (this.floor.hasTileAt(col, row)) {
      this.floor.removeTileAt(col, row);
    }
    if (!newTile) return;
    newTile.index = autoTile(newTile, this.scene.matrix);
    newTile.tint = 0x798c9a;
    newTile.properties.type = "wall";
    // newTile.alpha = 0.75;
  }

  placeInitialTiles() {
    this.floor.forEachTile((tile) => {
      this.placeEmptyFloorTile(tile.x, tile.y);
    });
  }
}
