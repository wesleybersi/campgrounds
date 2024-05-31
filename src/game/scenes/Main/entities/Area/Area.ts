import MainScene from "../../MainScene";
import { CELL_SIZE } from "../../constants";

export class Area extends Phaser.GameObjects.Rectangle {
  scene: MainScene;

  rect: { [key: string]: { col: number; row: number } };
  grid: { col: number; row: number }[][] = [];
  isSelected = false;
  constructor(
    scene: MainScene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(
      scene,
      Math.floor(x / CELL_SIZE) * CELL_SIZE,
      Math.floor(y / CELL_SIZE) * CELL_SIZE,
      Math.ceil(width / CELL_SIZE) * CELL_SIZE,
      Math.ceil(height / CELL_SIZE) * CELL_SIZE
    );
    this.scene = scene;
    this.rect = {
      topLeft: {
        col: Math.floor(x / CELL_SIZE),
        row: Math.floor(y / CELL_SIZE),
      },
      bottomRight: {
        col: Math.floor(x / CELL_SIZE) + Math.ceil(this.width / CELL_SIZE),
        row: Math.floor(y / CELL_SIZE) + Math.ceil(this.height / CELL_SIZE),
      },
    };
    this.setFillStyle(0x000000, scene.client.overlay === "area" ? 0.1 : 0);
    this.setOrigin(0);
    this.createGrid();

    for (const cell of this.grid.flat()) {
      this.scene.grid.areaMatrix[cell.row][cell.col] = this;
    }
    this.scene.add.existing(this);
  }
  createGrid() {
    const grid: { col: number; row: number; object: null }[][] = [];

    const numRows = Math.ceil(this.height / CELL_SIZE);
    const numCols = Math.ceil(this.width / CELL_SIZE);

    for (let row = 0; row < numRows; row++) {
      const newRow = [];
      for (let col = 0; col < numCols; col++) {
        newRow.push({
          col: col + this.rect.topLeft.col,
          row: row + this.rect.topLeft.row,
          object: null,
        });
      }
      grid.push(newRow);
    }

    this.grid = grid;
  }
  select() {
    this.scene.grid.areaMatrix.flat().forEach((area) => area?.deselect());
    this.isSelected = true;
    this.setStrokeStyle(CELL_SIZE / 10, 0xffffff);
  }
  deselect() {
    this.isSelected = false;
    this.setStrokeStyle(0);
  }
}
