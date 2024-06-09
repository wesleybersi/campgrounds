import MainScene from "../../MainScene";
import { CELL_SIZE } from "../../constants";

import { AStarFinder } from "astar-typescript";
import BasicTilemap from "./entities/Tilemap/tilemap";

import { getRandomInt } from "../../../../utils/helper-functions";

import { Forest } from "./entities/Forest/Forest";
import { StaticObject } from "./types";
import { Agent } from "../Agent/Agent";

import { Area } from "../Area/Area";
import { Rock } from "./entities/Rock/Rock";
import { Tree, treeSets } from "./entities/Tree/Tree";
import { Flower } from "./entities/Flower/Flower";

export class Grid {
  scene: MainScene;
  rows: number;
  cols: number;
  collisionMap: (0 | 1)[][];

  floorMatrix: ("grass" | "dirt" | "water" | "grass-elevated" | null)[][] = [];
  objectMatrix: (StaticObject | null)[][] = [];

  areaMap = new Map<string, Area>();

  tileMap: BasicTilemap;

  pathFinder: AStarFinder;

  constructor(scene: MainScene, rows: number, cols: number) {
    this.scene = scene;
    this.rows = rows;
    this.cols = cols;
    this.collisionMap = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => 0)
    );
    this.floorMatrix = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => null)
    );
    this.objectMatrix = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => null)
    );

    this.tileMap = new BasicTilemap(this, rows, cols);

    //ANCHOR Forests and trees
    const minForestAmount = Math.floor(
      (this.scene.colCount + this.scene.rowCount) / 20
    );
    const maxForestAmount = Math.floor(
      (this.scene.colCount + this.scene.rowCount) / 5
    );
    console.log(minForestAmount, maxForestAmount);
    const forestAmount = getRandomInt(32, maxForestAmount);
    for (let i = 0; i < forestAmount; i++) {
      const iterations = getRandomInt(8, 250);
      new Forest(this, iterations);
    }

    //ANCHOR Random trees
    const minTrees = Math.floor(
      (this.scene.colCount + this.scene.rowCount) / 10
    );
    const maxTrees = Math.floor(
      (this.scene.colCount + this.scene.rowCount) / 2
    );
    const treeAmount = getRandomInt(minTrees, maxTrees);
    for (let i = 0; i < treeAmount; i++) {
      const { row, col } = this.getRandomEmptyCell();
      new Tree(this, null, col, row, getRandomInt(treeSets.length));
    }

    //ANCHOR Rocks
    const minRocks = Math.floor(
      (this.scene.colCount + this.scene.rowCount) / 10
    );
    const maxRocks = Math.floor(
      (this.scene.colCount + this.scene.rowCount) / 2
    );
    const rockAmount = getRandomInt(minRocks, maxRocks);
    for (let i = 0; i < rockAmount; i++) {
      const { row, col } = this.getRandomEmptyCell();
      new Rock(this, col, row);
    }

    //ANCHOR Rocks
    const minFlowers = Math.floor(
      (this.scene.colCount + this.scene.rowCount) / 6
    );
    const maxFlowers = Math.floor(
      (this.scene.colCount + this.scene.rowCount) / 2
    );
    const flowerAmount = getRandomInt(minFlowers, maxFlowers);
    for (let i = 0; i < flowerAmount; i++) {
      const { row, col } = this.getRandomEmptyCell();
      new Flower(this, col, row, true);
    }

    this.pathFinder = new AStarFinder({
      grid: {
        matrix: this.collisionMap,
      },
      diagonalAllowed: true,
    });
  }
  update(delta: number) {
    this.pathFinder = new AStarFinder({
      grid: {
        matrix: this.collisionMap,
      },
      diagonalAllowed: true,
      heuristic: "Manhattan",
      allowPathAsCloseAsPossible: true,
    });
  }
  getAreas(type: "*" | "storage" | "reception") {
    const set = new Set<Area>(this.areaMap.values());
    switch (type) {
      case "*":
        return [...set];
      case "storage":
      case "reception":
        return [...set].filter((area) => area.type === type);
    }
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

  getNeighbors(col: number, row: number): { col: number; row: number }[] {
    return [
      { row: row + 1, col: col },
      { row: row, col: col - 1 },
      { row: row, col: col + 1 },
      { row: row - 1, col: col },
    ].filter((cell) => this.isWithinBounds(cell.col, cell.row));
  }

  getRandomEmptyCell(): { row: number; col: number } {
    const row = getRandomInt(this.rows);
    const col = getRandomInt(this.cols);

    if (!this.objectMatrix[row][col] && !this.collisionMap[row][col])
      return { row, col };
    else return this.getRandomEmptyCell();
  }

  getOverlappingCells(
    x: number,
    y: number,
    radius: number
  ): { row: number; col: number }[] {
    const cells: { row: number; col: number }[] = [];
    const startX = Math.floor((x - radius / 2) / CELL_SIZE);
    const startY = Math.floor((y - radius / 2) / CELL_SIZE);
    const endX = Math.floor((x + radius / 2) / CELL_SIZE);
    const endY = Math.floor((y + radius / 2) / CELL_SIZE);

    for (let col = startX; col <= endX; col++) {
      for (let row = startY; row <= endY; row++) {
        cells.push({ row, col });
      }
    }
    return cells;
  }
  isWithinBounds(col: number, row: number) {
    if (col < 0 || row < 0) return false;
    if (col > this.cols - 1 || row > this.rows - 1) return false;
    return true;
  }
}
