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

export class Grid {
  scene: MainScene;
  rows: number;
  cols: number;
  collisionMap: (0 | 1)[][];

  floorMatrix: ("grass" | "dirt" | "water" | "grass-elevated" | null)[][] = [];
  objectMatrix: (StaticObject | null)[][] = [];
  areaMatrix: (Area | null)[][] = [];

  tileMap: BasicTilemap;
  tracker: Set<Agent>[][] = [];
  pathFinder: AStarFinder;

  constructor(scene: MainScene, rows: number, cols: number) {
    this.scene = scene;
    this.rows = rows;
    this.cols = cols;
    this.collisionMap = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => 0)
    );
    this.tracker = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => new Set())
    );

    this.floorMatrix = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => null)
    );
    this.objectMatrix = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => null)
    );
    this.areaMatrix = Array.from({ length: this.rows }, () =>
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

    this.pathFinder = new AStarFinder({
      grid: {
        matrix: this.collisionMap,
      },
      diagonalAllowed: true,
    });
  }
  update(delta: number) {
    if (this.scene.frameCounter % 30 === 0) {
      this.tracker = Array.from({ length: this.rows }, () =>
        Array.from({ length: this.cols }, () => new Set())
      );

      const agents = this.scene.allAgents;
      for (const agent of agents) {
        this.track(agent);
      }
    }

    this.pathFinder = new AStarFinder({
      grid: {
        matrix: this.collisionMap,
      },
      diagonalAllowed: true,
      heuristic: "Manhattan",
      // allowPathAsCloseAsPossible: false,
      allowPathAsCloseAsPossible: true,
    });
  }
  getRandomEmptyCell(): { row: number; col: number } {
    const row = getRandomInt(this.rows);
    const col = getRandomInt(this.cols);

    if (!this.objectMatrix[row][col] && !this.collisionMap[row][col])
      return { row, col };
    else return this.getRandomEmptyCell();
  }
  track(agent: Agent) {
    const cells = this.getOverlappingCells(agent.x, agent.y, CELL_SIZE);
    for (const cell of cells) {
      if (this.isWithinBounds(cell.col, cell.row)) {
        this.tracker[cell.row][cell.col].add(agent);
      }
    }
  }
  getAgentsInCell(row: number, col: number): Set<Agent> {
    return this.tracker[row][col];
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
