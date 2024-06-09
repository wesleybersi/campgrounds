import { Position } from "../../../../types";
import { absolutePos } from "../../../../utils/helper-functions";
import MainScene from "../../MainScene";
import { Storage } from "../Resources/entities/Storage/Storage";
import { Reception } from "../Recreation/entities/Reception/Reception";

interface AreaCell {
  col: number;
  row: number;
  graphic?: Phaser.GameObjects.Image;
}
export class Area {
  type: "storage" | "reception" | "forester's lodge";
  scene: MainScene;
  cells: AreaCell[] = [];
  isSelected = false;
  module: Storage | Reception;
  constructor(
    scene: MainScene,
    type: "storage" | "reception" | "forester's lodge",
    cells: { col: number; row: number }[]
  ) {
    this.scene = scene;
    this.type = type;
    switch (type) {
      case "storage":
        this.module = new Storage(this);
        break;
      case "reception":
        this.module = new Reception(this);
        break;
      case "forester's lodge":
        this.module = new Reception(this);
        break;
    }
    this.extend(cells);
  }
  extend(cells: { col: number; row: number }[]) {
    for (const { col, row } of cells) {
      const cellInPlace = this.scene.grid.areaMap.has(`${col},${row}`);
      if (cellInPlace) continue;
      if (this.scene.client.overlay.areas) {
        const graphic = this.scene.add
          .image(absolutePos(col), absolutePos(row), "white-tile")
          .setAlpha((col + row) % 2 === 0 ? 0.1 : 0.2)
          .setTint(this.module.color);

        this.cells.push({ col, row, graphic });
        this.scene.grid.areaMap.set(`${col},${row}`, this);

        if (this.module instanceof Storage) this.module.addSlot(col, row);
      }
    }
  }

  clear(cells: { col: number; row: number }[]) {
    for (const { col, row } of cells) {
      const cellInPlace = this.cells.find(
        (cell) => cell.col === col && cell.row === row
      );
      if (!cellInPlace) continue;

      cellInPlace.graphic?.destroy();
      this.scene.grid.areaMap.delete(`${col},${row}`);

      if (this.module instanceof Storage) this.module.clearSlot(col, row);
    }

    const updatedCells = this.cells.filter((cell) =>
      this.scene.grid.areaMap.has(`${cell.col},${cell.row}`)
    );
    this.cells = updatedCells;

    this.splitIfDivided();
  }
  splitIfDivided(): void {
    const regions: AreaCell[][] = [];
    const visited: Set<string> = new Set();

    const floodFill = (cell: Position, region: Position[]): void => {
      const key = `${cell.col},${cell.row}`;
      if (visited.has(key)) return;

      visited.add(key);
      region.push(cell);

      const neighbors = this.getNeighbors(cell.col, cell.row); // Implement this function to get neighboring cells
      neighbors.forEach((neighbor) => floodFill(neighbor, region));
    };

    this.cells.forEach((cell) => {
      console.count("cell");
      const key = `${cell.col},${cell.row}`;
      if (!visited.has(key)) {
        const region: AreaCell[] = [];
        floodFill(cell, region);
        regions.push(region);
      }
    });

    if (regions.length > 1) {
      console.log(
        `The area is divided into ${regions.length} connected regions.`
      );

      //Destroy this instance and create new ones based on the split regions
      this.clearAll();

      for (const region of regions) {
        const cells: Position[] = region.map((cell) => ({
          col: cell.col,
          row: cell.row,
        }));
        const area = new Area(this.scene, this.type, cells);
        if (this.module instanceof Storage && area.module instanceof Storage) {
          area.module.copySettings(this.module);
        }
      }
    }
  }

  getNeighbors(col: number, row: number): { col: number; row: number }[] {
    return [
      { row: row + 1, col: col },
      { row: row, col: col - 1 },
      { row: row, col: col + 1 },
      { row: row - 1, col: col },
    ].filter((cell) =>
      this.cells.find((c) => c.row === cell.row && c.col === cell.col)
    );
  }

  clearAll() {
    for (const { col, row, graphic } of this.cells) {
      graphic?.destroy();
      this.scene.grid.areaMap.delete(`${col},${row}`);
    }
    this.cells = [];
  }

  show() {
    for (const cell of this.cells) {
      cell.graphic = this.scene.add
        .image(absolutePos(cell.col), absolutePos(cell.row), "white-tile")
        .setAlpha((cell.col + cell.row) % 2 === 0 ? 0.1 : 0.2)
        .setTint(this.module.color);
    }
  }
  hide() {
    for (const { graphic } of this.cells) {
      graphic?.destroy();
    }
  }
}
