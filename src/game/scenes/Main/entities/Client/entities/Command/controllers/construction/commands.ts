import MainScene from "../../../../../../MainScene";
import { FloorPlanks } from "../../../../../Grid/entities/FloorPlanks/FloorPlanks";
import { Task } from "../../../../../Labour/entities/Task/Task";
import { Controller } from "../types";

const isValid = (scene: MainScene, col: number, row: number) => {
  if (scene.grid.objectMatrix[row][col]) return false;
  if (scene.labour.taskGrid[row][col]) return false;
  return true;
};

export const constructionCommands: Controller = {
  ["dirt"]: {
    selectionType: "grid",
    onPointerUp(scene, pointer, cells) {
      for (const { col, row } of cells) {
        if (!isValid(scene, col, row)) return;
        new Task(scene, "builder", col, row, 0.5, undefined, () => {
          scene.grid.tileMap.placeDirtTile(col, row);
        });
      }
    },
  },
  ["wooden planks"]: {
    selectionType: "grid-empty",
    onPointerUp(scene, pointer, cells) {
      for (const { col, row } of cells) {
        if (!isValid(scene, col, row)) continue;
        new Task(scene, "builder", col, row, 0.5, undefined, () => {
          new FloorPlanks(scene.grid, col, row);
        });
      }
    },
  },
};
