import MainScene from "../../../../../../MainScene";
import { Reception } from "../../../../../Recreation/entities/Reception/Reception";
import { Site } from "../../../../../Recreation/entities/Site/Site";
import { Controller } from "../types";

const isValid = (scene: MainScene, cells: { col: number; row: number }[]) => {
  for (const { col, row } of cells) {
    if (scene.grid.areaMatrix[row][col]) {
      return false;
    }
  }
  return true;
};

export const areaCommands: Controller = {
  ["reception"]: {
    selectionType: "grid",
    onPointerUp(scene, pointer, cells) {
      if (!scene.client.selection) return;
      if (isValid(scene, cells)) {
        new Reception(
          scene,
          scene.client.selection.rect.x,
          scene.client.selection.rect.y,
          scene.client.selection.rect.width,
          scene.client.selection.rect.height
        );
      }
    },
  },
  ["campsite"]: {
    selectionType: "grid",
    onPointerUp(scene, pointer, cells) {
      if (!scene.client.selection) return;
      if (isValid(scene, cells)) {
        new Site(
          scene,
          scene.client.selection.rect.x,
          scene.client.selection.rect.y,
          scene.client.selection.rect.width,
          scene.client.selection.rect.height
        );
      }
    },
  },
};
