import { getRandomInt } from "../../../../../../../../utils/helper-functions";
import MainScene from "../../../../../../MainScene";
import { Flower } from "../../../../../Grid/entities/Flower/Flower";
import { Hedge } from "../../../../../Grid/entities/Hedge/Hedge";
import { Rock } from "../../../../../Grid/entities/Rock/Rock";
import { Tree, treeSets } from "../../../../../Grid/entities/Tree/Tree";
import { Task } from "../../../../../Labour/entities/Task/Task";
import { Controller } from "../types";

const isValid = (scene: MainScene, col: number, row: number) => {
  if (scene.grid.objectMatrix[row][col]) return false;
  if (scene.labour.taskGrid[row][col]) return false;
  return true;
};

export const forestingCommands: Controller = {
  ["harvest"]: {
    selectionType: "free",
    onPointerUp: (scene, _, cells) => {
      for (const { col, row } of cells) {
        if (scene.labour.taskGrid[row][col]) continue;
        const target = scene.grid.objectMatrix[row][col];
        if (
          target &&
          (target instanceof Tree ||
            target instanceof Rock ||
            target instanceof Flower)
        ) {
          new Task(
            scene,
            "forester",
            col,
            row,
            target.harvestMultiplier,
            undefined,
            () => {
              target.harvest();
              target.remove();
            },
            0xff8888
          );
        }
      }
    },
  },
  ["plant tree"]: {
    selectionType: "none",
    onPointerDown: (scene, pointer, col, row) => {
      if (!isValid(scene, col, row)) return;
      new Task(scene, "forester", col, row, 0.1, undefined, () => {
        new Tree(scene.grid, null, col, row, getRandomInt(treeSets.length));
      });
    },
  },
  ["plant flower"]: {
    selectionType: "none",
    onPointerDown: (scene, pointer, col, row) => {
      if (!isValid(scene, col, row)) return;
      new Task(scene, "forester", col, row, 0.1, undefined, () => {
        new Flower(scene.grid, col, row);
      });
    },
  },
  ["place hedge"]: {
    selectionType: "grid-empty",
    onPointerUp(scene, pointer, cells) {
      for (const { col, row } of cells) {
        if (!isValid(scene, col, row)) return;
        new Task(scene, "forester", col, row, 0.1, undefined, () => {
          new Hedge(scene.grid, col, row);
        });
      }
    },
  },
};
