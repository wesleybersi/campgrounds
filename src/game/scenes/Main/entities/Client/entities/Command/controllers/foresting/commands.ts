import MainScene from "../../../../../../MainScene";
import { Flower } from "../../../../../Grid/entities/Flower/Flower";
import { Hedge } from "../../../../../Grid/entities/Hedge/Hedge";
import { Rock } from "../../../../../Grid/entities/Rock/Rock";
import { Tree } from "../../../../../Grid/entities/Tree/Tree";
import { LawnMower } from "../../../../../Staff/entities/LawnMower/LawnMower";
import { Task } from "../../../../../Staff/entities/Task/Task";
import { Controller } from "../types";

const isValid = (scene: MainScene, col: number, row: number) => {
  if (scene.grid.objectMatrix[row][col]) return false;
  if (scene.staff.taskMatrix[row][col]) return false;
  if (scene.grid.collisionMap[row][col] === 1) return false;
  return true;
};

export const forestingCommands: Controller = {
  ["harvest"]: {
    selectionType: "free",
    onPointerUp: (scene, _, cells) => {
      for (const { col, row } of cells) {
        if (scene.staff.taskMatrix[row][col]) continue;
        const target = scene.grid.objectMatrix[row][col];
        if (
          target &&
          (target instanceof Tree ||
            target instanceof Rock ||
            target instanceof Flower)
        ) {
          new Task(scene, col, row, {
            labor: ["forester"],
            multiplier: target.harvestMultiplier,
            color: 0xff0000,
            onComplete: () => {
              target.harvest();
              target.remove();
            },
          });
        }
      }
    },
  },

  ["mow grass"]: {
    selectionType: "grid",
    onPointerUp: (scene, _, cells) => {
      for (const { col, row } of cells) {
        if (scene.staff.taskMatrix[row][col]) continue;
        const tileInPlace = scene.grid.floorMatrix[row][col];
        if (tileInPlace !== "grass") continue;

        //TODO Forester needs lawn-mower tool.

        new Task(scene, col, row, {
          labor: ["forester"],
          multiplier: Infinity,
          color: 0xff0000,
          requiredTool: "lawnmower",
          onComplete: () => {
            scene.grid.tileMap.placeGrassTile(col, row, 28);
          },
        });
      }
    },
  },
  ["plant tree"]: {
    selectionType: "none",
    onPointerDown: (scene, pointer, col, row) => {
      const index = scene.client.command.index;
      if (!isValid(scene, col, row)) return;
      new Task(scene, col, row, {
        labor: ["forester"],
        multiplier: 0.1,
        onComplete: () => {
          new Tree(scene.grid, null, col, row, 0, index);
        },
      });
    },
  },
  ["plant flower"]: {
    selectionType: "none",
    onPointerDown: (scene, pointer, col, row) => {
      if (!isValid(scene, col, row)) return;
      new Task(scene, col, row, {
        labor: ["forester"],
        multiplier: 0.5,
        onComplete: () => new Flower(scene.grid, col, row),
      });
    },
  },
  ["place hedge"]: {
    selectionType: "grid-empty",
    onPointerUp(scene, pointer, cells) {
      for (const { col, row } of cells) {
        if (!isValid(scene, col, row)) return;
        new Task(scene, col, row, {
          labor: ["forester"],
          multiplier: 0.1,
          onComplete: () => new Hedge(scene.grid, col, row),
        });
      }
    },
  },
};
