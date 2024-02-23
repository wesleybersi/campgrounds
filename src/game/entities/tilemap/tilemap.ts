import { randomInt } from "crypto";
import { CELL_HEIGHT, CELL_WIDTH } from "../../scenes/Main/constants";
import MainScene from "../../scenes/Main/MainScene";
import { autoTile } from "./walls/auto-tile";
import { getRandomInt } from "../../utils/helper-functions";

export default class BasicTilemap {
  scene: MainScene;
  floorMap: Phaser.Tilemaps.Tilemap;
  wallMap: Phaser.Tilemaps.Tilemap;
  floorTiles!: Phaser.Tilemaps.Tileset;
  floor!: Phaser.Tilemaps.TilemapLayer;
  wallTiles!: Phaser.Tilemaps.Tileset;
  walls!: Phaser.Tilemaps.TilemapLayer;
  highlightedCells!: Phaser.Tilemaps.TilemapLayer;
  palette: {
    floor: number;
    wallInner: number;
    wallOuter: number;
    carpet: number;
    water: number;
  };
  constructor(scene: MainScene, rows: number, cols: number) {
    this.scene = scene as MainScene;
    this.floorMap = scene.make.tilemap({
      tileWidth: 128,
      tileHeight: 128,
      width: cols,
      height: rows,
    });
    this.wallMap = scene.make.tilemap({
      tileWidth: 128,
      tileHeight: 128,
      width: cols,
      height: rows,
    });

    this.palette = {
      floor: 0x676f7b,
      carpet: 0x6c0000,
      wallInner: 0x8b4e37,
      wallOuter: 0x1e1c23,
      water: 0x2f7ca9,
    };
    this.palette = {
      floor: 0x96a84f,
      carpet: 0xe6c55c,
      wallInner: 0x8b4e37,
      wallOuter: 0x1e1c23,
      water: 0x2f7ca9,
    };

    const floorTiles = this.floorMap.addTilesetImage("white-tile");
    if (floorTiles) this.floorTiles = floorTiles;

    const wallTiles = this.wallMap.addTilesetImage("white-tile");
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

    this.floor.setDepth(0);
    this.walls.setDepth(1);
    this.highlightedCells.setDepth(10000);
    this.highlightedCells.setAlpha(0);

    this.scene.events.once("clear", this.remove, this);
  }

  placeWaterTile(col: number, row: number) {
    const newTile = this.floor.putTileAt(0, col, row);
    if (!newTile) return;
    newTile.tint = 0x2f7ca9;
  }

  placeEmptyFloorTile(col: number, row: number, frame: number) {
    const newTile = this.floor.putTileAt(0, col, row);
    if (!newTile) return;

    //TODO Tint gets darker based on depth

    // newTile.tint = 0x7fbf5f;
    // newTile.tint = 0x5eaf4f;
    // newTile.alpha = getRandomInt(8, 10) / 10;

    // newTile.tint = 0x4d454a;
    if (frame >= 6) {
      newTile.tint = this.palette.carpet;
    } else {
      newTile.tint = this.palette.floor;
    }
  }

  placeWallTile(col: number, row: number, isCracked?: boolean) {
    const newTile = this.walls.putTileAt(0, col, row);

    if (!newTile) return;

    // newTile.index = autoTile(newTile, this.scene.objectMatrix, isCracked);
    // newTile.tint = 0x798c9a;
    newTile.properties.type = "wall";
    newTile.tint = this.palette.wallInner;
  }

  placeInitialTiles() {
    this.floor.forEachTile((tile) => {
      this.placeEmptyFloorTile(tile.x, tile.y, 0);
    });
  }
  remove() {
    this.floor.forEachTile((tile) => tile.destroy());
    this.floor.destroy();
    this.highlightedCells.forEachTile((tile) => tile.destroy());
    this.highlightedCells.destroy();
    this.floorMap.destroy();
    this.wallMap.destroy();
    this.scene.events.removeListener("clear", this.remove, this);
  }
}
