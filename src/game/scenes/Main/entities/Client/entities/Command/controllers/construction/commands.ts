import MainScene from "../../../../../../MainScene";
import { FloorPlanks } from "../../../../../Grid/entities/FloorPlanks/FloorPlanks";
import { Flower } from "../../../../../Grid/entities/Flower/Flower";
import { Rock } from "../../../../../Grid/entities/Rock/Rock";
import { Tree } from "../../../../../Grid/entities/Tree/Tree";
import { Task } from "../../../../../Staff/entities/Task/Task";
import { Controller } from "../types";

const isValid = (scene: MainScene, col: number, row: number) => {
  if (scene.grid.objectMatrix[row][col]) return false;
  if (scene.staff.taskMatrix[row][col]) return false;
  if (scene.grid.collisionMap[row][col] === 1) return false;
  return true;
};

export const constructionCommands: Controller = {
  ["bulldozer"]: {
    selectionType: "grid",
    onPointerUp: (scene, pointer, cells) => {
      for (const { col, row } of cells) {
        const taskInPlace = scene.staff.taskMatrix[row][col];
        taskInPlace?.remove();

        const objectInPlace = scene.grid.objectMatrix[row][col];
        if (objectInPlace) {
          if (
            objectInPlace instanceof Tree ||
            objectInPlace instanceof Rock ||
            objectInPlace instanceof Flower
          )
            return;
          new Task(scene, col, row, {
            labor: ["builder"],
            multiplier: 0.1,
            color: 0xff0000,
            onComplete: () => objectInPlace.remove(),
          });
        }
      }
    },
  },
  ["dirt"]: {
    selectionType: "grid",
    onPointerUp(scene, pointer, cells) {
      for (const { col, row } of cells) {
        if (!isValid(scene, col, row)) return;
        new Task(scene, col, row, {
          labor: ["builder"],
          multiplier: 0.5,
          onComplete: () => {
            scene.grid.tileMap.placeDirtTile(col, row);
          },
        });
      }
    },
  },
  ["wooden planks"]: {
    selectionType: "grid-empty",
    onPointerUp(scene, pointer, cells) {
      for (const { col, row } of cells) {
        if (!isValid(scene, col, row)) continue;
        new Task(scene, col, row, {
          labor: ["builder"],
          requiredResources: { wood: 1 },
          multiplier: 0.5,
          onComplete: () => {
            new FloorPlanks(scene.grid, col, row);
          },
        });
      }
    },
  },
};
