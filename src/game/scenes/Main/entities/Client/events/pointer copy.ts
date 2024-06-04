import { CELL_SIZE, MAX_ZOOM, MIN_ZOOM, ZOOM_FACTOR } from "../../../constants";
import { Tree, treeSets } from "../../Grid/entities/Tree/Tree";
import { Wall } from "../../Grid/entities/Wall/Wall";
import { Forester } from "../../Labour/force/Forester/Forester";
import { Builder } from "../../Labour/force/Builder/Builder";

import { Client } from "../Client";
import { Selection } from "../entities/Selection/Selection";
import { Site } from "../../Recreation/entities/Site/Site";
import { Reception } from "../../Recreation/entities/Reception/Reception";

import { getRandomInt } from "../../../../../utils/helper-functions";
import { Rock } from "../../Grid/entities/Rock/Rock";

import { Task } from "../../Labour/entities/Task/Task";

import { Flower } from "../../Grid/entities/Flower/Flower";

import { FloorPlanks } from "../../Grid/entities/FloorPlanks/FloorPlanks";

import { Hedge } from "../../Grid/entities/Hedge/Hedge";

export function pointerEvents(this: Client) {
  const pointerMove = () => {
    this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!this.scene.hasLoaded) return;
      this.target.x = pointer.worldX;
      this.target.y = pointer.worldY;
      const row = Math.floor(pointer.worldY / CELL_SIZE);
      const col = Math.floor(pointer.worldX / CELL_SIZE);

      this.target.row = row;
      this.target.col = col;

      if (pointer.leftButtonDown() || pointer.rightButtonDown()) {
        this.selection?.select(
          pointer.worldX,
          pointer.worldY,
          pointer.leftButtonDown() ? "left" : "right"
        );
      }

      if (this.keys.meta && pointer.leftButtonDown()) {
        const camera = this.scene.cameras.main;
        const deltaX = (pointer.x - pointer.prevPosition.x) / camera.zoom;
        const deltaY = (pointer.y - pointer.prevPosition.y) / camera.zoom;

        camera.scrollX -= deltaX;
        camera.scrollY -= deltaY;
      }
    });
  };

  const pointerDown = () => {
    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (!this.scene.hasLoaded) return;
      const row = this.target.row;
      const col = this.target.col;
      // const currentCell = this.scene.grid.getAgentsInCell(row, col);

      if (this.keys.meta) return;

      // if (this.command && this.command.onPointerDown) {
      //   this.command.onPointerDown();
      // }
      // this.command.onPointerDown(col, row);
      // this.command.onPointerUp();

      if (!this.selection) {
        new Selection(
          this,
          pointer.worldX,
          pointer.worldY,
          pointer.leftButtonDown() ? "left" : "right"
        );
      }

      switch (this.order) {
        case "":
          //Order of importance, returns info

          // const area = this.scene.grid.areaMatrix[row][col];
          // if (area) {
          //   if (area.isSelected) area.deselect();
          //   else area.select();
          // }

          // this.selected?.deselect();
          // this.selected = null;
          break;
        case "plant tree":
          if (pointer.leftButtonDown()) {
            if (this.scene.labour.taskGrid[row][col]) break;
            new Task(this.scene, "forester", col, row, 0.1, undefined, () => {
              new Tree(
                this.scene.grid,
                null,
                col,
                row,
                getRandomInt(treeSets.length)
              );
            });
          }
          break;
        case "plant flower":
          if (pointer.leftButtonDown()) {
            if (this.scene.labour.taskGrid[row][col]) break;
            new Task(this.scene, "forester", col, row, 0.1, undefined, () => {
              new Flower(this.scene.grid, col, row);
            });
          }
          break;

        case "water":
          this.scene.grid.tileMap.placeWaterTile(col, row);
          break;
      }
    });
  };

  const pointerUp = () => {
    this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (!this.scene.hasLoaded) {
        return;
      }

      if (this.command && this.command.onPointerUp) {
        this.command.onPointerUp();
      }

      if (!this.selection) return;
      const cells = this.selection.getSelectedTiles();

      if (this.isBulldozing && this.selection.button === "left") {
        for (const { col, row } of cells) {
          const taskInPlace = this.scene.labour.taskGrid[row][col];
          if (taskInPlace) {
            taskInPlace.remove();
            continue;
          }

          const objInPlace = this.scene.grid.objectMatrix[row][col];
          if (objInPlace) {
            if (
              objInPlace instanceof Wall ||
              objInPlace instanceof Hedge ||
              objInPlace instanceof FloorPlanks
            ) {
              new Task(
                this.scene,
                "builder",
                col,
                row,
                0.1,
                undefined,
                () => {
                  objInPlace.remove();
                },
                0xff0000
              );
              // }
            }
          }
          this.selection?.remove();
        }
      }

      if (this.selection.button === "right") {
        for (const { col, row } of cells) {
          const taskInPlace = this.scene.labour.taskGrid[row][col];
          if (taskInPlace) {
            taskInPlace.remove();
          }
        }
        this.selection?.remove();
        return;
      }

      if (this.order === "campsite") {
        let invalid = false;
        for (const { col, row } of cells.flat()) {
          if (
            this.scene.grid.areaMatrix[row][col] ||
            this.scene.grid.collisionMap[row][col]
          ) {
            invalid = true;
            break;
          }
        }
        if (!invalid) {
          new Site(
            this.scene,
            this.selection.rect.x,
            this.selection.rect.y,
            this.selection.rect.width,
            this.selection.rect.height
          );
        }
      } else if (this.order === "reception") {
        let invalid = false;
        for (const { col, row } of cells.flat()) {
          if (this.scene.grid.areaMatrix[row][col]) {
            invalid = true;
            break;
          }
        }
        if (!invalid) {
          new Reception(
            this.scene,
            this.selection.rect.x,
            this.selection.rect.y,
            this.selection.rect.width,
            this.selection.rect.height
          );
        }
      } else {
        for (const { col, row } of cells.sort(() => Math.random() - 0.5)) {
          switch (this.order) {
            case "harvest":
              {
                const obj = this.scene.grid.objectMatrix[row][col];
                if (
                  obj &&
                  (obj instanceof Tree ||
                    obj instanceof Rock ||
                    obj instanceof Flower)
                ) {
                  obj.markForHarvest();
                }
              }
              break;
            case "cancel":
              {
                const task = this.scene.labour.taskGrid[row][col];
                if (task) task.remove();

                const obj = this.scene.grid.objectMatrix[row][col];
                if (obj && obj instanceof Tree) {
                  obj.unmarkForHarvest();
                }
              }
              break;
            case "dirt":
              if (pointer.leftButtonReleased()) {
                if (this.scene.labour.taskGrid[row][col]) break;

                new Task(
                  this.scene,
                  "builder",
                  col,
                  row,
                  0.5,
                  undefined,
                  () => {
                    this.scene.grid.tileMap.placeDirtTile(col, row);
                  }
                );
              }
              break;
            case "concrete":
              if (pointer.leftButtonReleased()) {
                this.scene.grid.tileMap.placeConcreteTile(col, row);
              }
              break;
            case "floor planks":
              if (pointer.leftButtonReleased()) {
                const objInPlace = this.scene.grid.objectMatrix[row][col];
                if (objInPlace) break;
                new Task(
                  this.scene,
                  "builder",
                  col,
                  row,
                  0.5,
                  undefined,
                  () => {
                    new FloorPlanks(this.scene.grid, col, row);
                  }
                );
              }
              break;
            case "wooden wall":
            case "hedge":
              if (pointer.leftButtonReleased()) {
                const objInPlace = this.scene.grid.objectMatrix[row][col];
                const taskInPlace = this.scene.labour.taskGrid[row][col];
                if (this.keys.meta) {
                  // if (taskInPlace) taskInPlace.remove();
                  // if (
                  //   objInPlace &&
                  //   (objInPlace instanceof Wall || objInPlace instanceof Task)
                  // ) {
                  //   objInPlace.remove();
                  // }
                } else {
                  if (objInPlace) break;
                  if (taskInPlace) break;
                  if (this.order === "hedge") {
                    new Task(
                      this.scene,
                      "forester",
                      col,
                      row,
                      0.1,
                      undefined,
                      () => {
                        new Hedge(this.scene.grid, col, row);
                      }
                    );
                  } else if (this.order === "wooden wall") {
                    new Task(
                      this.scene,
                      "builder",
                      col,
                      row,
                      0.1,
                      undefined,
                      () => {
                        new Wall(this.scene.grid, "wood", col, row);
                      }
                    );
                  }
                }
              }
              break;
          }
        }
      }
      this.selection.remove();
    });
  };

  const wheel = () => {
    this.scene.input.on(
      "wheel",
      (pointer: Phaser.Input.Pointer) => {
        if (!this.scene.hasLoaded) return;
        const camera = this.scene.cameras.main;
        const prevZoom = camera.zoom;

        if (pointer.deltaY < 0) {
          const zoom = camera.zoom * ZOOM_FACTOR;
          const cappedZoom = Math.min(MAX_ZOOM, zoom);
          camera.setZoom(cappedZoom);
        } else if (pointer.deltaY > 0) {
          if (
            camera.worldView.right > this.scene.colCount * CELL_SIZE ||
            camera.worldView.bottom > this.scene.rowCount * CELL_SIZE
          ) {
            return;
          }
          const zoom = camera.zoom / ZOOM_FACTOR;
          const cappedZoom = Math.max(MIN_ZOOM, zoom);
          camera.setZoom(cappedZoom);
        }

        // Calculate the zoom ratio and the difference in camera position
        const zoomRatio = camera.zoom / prevZoom;
        const dx =
          (pointer.worldX - camera.worldView.centerX) * (1 - zoomRatio);
        const dy =
          (pointer.worldY - camera.worldView.centerY) * (1 - zoomRatio);

        // Set the new camera position
        camera.scrollX = camera.scrollX - dx;
        camera.scrollY = camera.scrollY - dy;
      },
      this.scene
    );
  };

  this.scene.input.mouse?.disableContextMenu();
  pointerMove();
  pointerDown();
  pointerUp();
  wheel();
}
