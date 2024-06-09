import { Position } from "../../../../../../../../types";
import MainScene from "../../../../../../MainScene";
import { Area } from "../../../../../Area/Area";
import { Controller } from "../types";

export function extendAreaInPlace(
  scene: MainScene,
  cells: Position[],
  type: "storage" | "reception" | "forester's lodge"
): boolean {
  for (const cell of cells) {
    const areaInPlace = scene.grid.areaMap.get(`${cell.col},${cell.row}`);
    if (areaInPlace && areaInPlace.type === type) {
      areaInPlace.extend(cells);
      return true;
    }
    const neighbors = scene.grid.getNeighbors(cell.col, cell.row);
    for (const neighbor of neighbors) {
      const areaInPlace = scene.grid.areaMap.get(
        `${neighbor.col},${neighbor.row}`
      );
      if (areaInPlace && areaInPlace.type === type) {
        areaInPlace.extend(cells);
        return true;
      }
    }
  }
  return false;
}

export const areaCommands: Controller = {
  ["clear"]: {
    selectionType: "grid",
    onPointerUp(scene, pointer, cells) {
      if (!scene.client.selection) return;

      const areasInPlace = new Set<Area>();
      for (const cell of cells) {
        const areaInPlace = scene.grid.areaMap.get(`${cell.col},${cell.row}`);
        if (areaInPlace) areasInPlace.add(areaInPlace);
      }
      for (const area of areasInPlace) {
        area.clear(cells);
      }
    },
  },
  ["storage"]: {
    selectionType: "grid",
    onPointerUp(scene, pointer, cells) {
      if (!scene.client.selection) return;
      if (!extendAreaInPlace(scene, cells, "storage")) {
        new Area(scene, "storage", cells);
      }
    },
  },
  ["reception"]: {
    selectionType: "grid",
    onPointerUp(scene, pointer, cells) {
      if (!scene.client.selection) return;
      if (!extendAreaInPlace(scene, cells, "reception")) {
        new Area(scene, "reception", cells);
      }
    },
  },
  ["forester's lodge"]: {
    selectionType: "grid",
    onPointerUp(scene, pointer, cells) {
      if (!scene.client.selection) return;
      if (!extendAreaInPlace(scene, cells, "forester's lodge")) {
        new Area(scene, "forester's lodge", cells);
      }
    },
  },
  // ["campsite"]: {
  //   selectionType: "grid",
  //   onPointerUp(scene, pointer, cells) {
  //     if (!scene.client.selection) return;
  //     if (isValid(scene, cells)) {
  //       new Site(scene, cells);
  //     }
  //   },
  // },
};
