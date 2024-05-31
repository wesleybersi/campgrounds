import { CELL_SIZE, MAX_ZOOM, MIN_ZOOM, ZOOM_FACTOR } from "../../../constants";
import { Tree } from "../../Grid/entities/Tree/Tree";
import { Wall } from "../../Grid/entities/Wall/Wall";
import { Forester } from "../../Labour/force/Forester/Forester";
import { Builder } from "../../Labour/force/Builder/Builder";
import { Blueprint } from "../../Labour/force/Builder/tasks/Blueprint";
import { Guest } from "../../Recreation/entities/Guest/Guest";

import { Client } from "../Client";
import { Selection } from "../entities/Selection/Selection";
import { Site } from "../../Recreation/entities/Site/Site";
import { Group } from "../../Recreation/entities/Group/Group";
import { Spawner } from "../../Recreation/entities/Spawner/Spawner";
import { Reception } from "../../Recreation/entities/Reception/Reception";

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

      if (pointer.leftButtonDown()) {
        this.selection?.select(pointer.worldX, pointer.worldY);
      }

      if (pointer.rightButtonDown()) {
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
      const currentCell = this.scene.grid.getAgentsInCell(row, col);

      if (!this.selection) {
        new Selection(this, pointer.worldX, pointer.worldY);
      }

      switch (this.placeMode) {
        case "":
          if (pointer.leftButtonDown()) {
            if (currentCell.size === 0) {
              this.selected?.deselect();
            }

            for (const worker of currentCell) {
              if (worker === this.selected) {
                worker.deselect();
                return;
              } else {
                this.selected?.deselect();
                worker.select();
                return;
              }
            }

            const area = this.scene.grid.areaMatrix[row][col];
            if (area) {
              if (area.isSelected) area.deselect();
              else area.select();
            }
          }
          if (pointer.rightButtonDown()) {
            if (this.selected) {
              // this.selected.goto(pointer.worldX, pointer.worldY);
            }
          }

          // this.selected?.deselect();
          // this.selected = null;
          break;
        case "spawn":
          if (pointer.leftButtonDown()) new Spawner(this.scene, col, row);
          break;

        case "wooden wall":
        case "hedge":
          if (pointer.leftButtonDown()) {
            const objInPlace = this.scene.grid.objectMatrix[row][col];
            if (this.keys.meta) {
              // this.scene.grid.collisionMap[row][col] = 0;
              // this.scene.grid.tileMap.removeWallTile(col, row);
              if (
                objInPlace &&
                (objInPlace instanceof Wall || objInPlace instanceof Blueprint)
              ) {
                objInPlace.remove();
              }
            } else {
              if (objInPlace) break;
              if (this.placeMode === "hedge") {
                new Blueprint(this.scene, "wall", "hedge", 25, col, row);
              } else if (this.placeMode === "wooden wall") {
                new Blueprint(this.scene, "wall", "wood", 25, col, row);
              }
            }
          }
          break;
        case "concrete":
          if (pointer.leftButtonDown()) {
            this.scene.grid.tileMap.placeConcreteTile(col, row);
          }
          break;
        case "dirt":
          if (pointer.leftButtonDown()) {
            this.scene.grid.tileMap.placeDirtTile(col, row);
          }
          break;
        case "water":
          this.scene.grid.tileMap.placeWaterTile(col, row);
          break;
        case "guests":
          if (pointer.leftButtonDown()) new Group(this.scene, col, row);
          break;

        case "forester":
        case "builder":
          if (pointer.leftButtonDown()) {
            if (this.keys.meta) {
              // for (const worker of currentCell) {
              //   worker?.remove();
              //   break;
              // }
            } else {
              console.log(currentCell);
              for (const agent of currentCell) {
                if (agent === this.selected) {
                  agent.deselect();
                  return;
                } else {
                  this.selected?.deselect();
                  agent.select();
                  return;
                }
              }
              if (!this.selected || currentCell.size === 0) {
                this.selected?.deselect();

                if (this.placeMode === "builder") {
                  const worker = new Builder(this.scene, col, row);
                  worker.select();
                } else if (this.placeMode === "forester") {
                  const forester = new Forester(this.scene, col, row);
                  forester.select();
                }
              }
            }
          }
          if (pointer.rightButtonDown()) {
            console.log(
              "Right - ",
              "row:",
              row,
              "col:",
              col,
              "x:",
              Math.floor(pointer.worldX),
              "y:",
              Math.floor(pointer.worldY)
            );
            //
          }
          break;
      }
      if (pointer.rightButtonDown()) {
        // this.placeMode = "";
      }
    });
  };

  const pointerUp = () => {
    this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (!this.scene.hasLoaded) return;
      if (pointer.leftButtonReleased()) {
        //
      }
      if (pointer.rightButtonReleased()) {
        this.selection?.remove();
        return;
        //
      }

      if (this.selection) {
        const cells = this.selection.getSelectedTiles();
        console.log(cells);

        if (this.placeMode === "campsite") {
          let invalid = false;
          for (const { col, row } of cells.flat()) {
            if (this.scene.grid.areaMatrix[row][col]) {
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
        } else if (this.placeMode === "reception") {
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
            switch (this.placeMode) {
              case "harvest":
                {
                  const obj = this.scene.grid.objectMatrix[row][col];
                  if (obj && obj instanceof Tree) {
                    obj.markForHarvest();
                  }
                }
                break;
              case "cancel":
                {
                  const obj = this.scene.grid.objectMatrix[row][col];
                  if (obj && obj instanceof Tree) {
                    obj.unmarkForHarvest();
                  }
                }
                break;
              case "dirt":
                if (pointer.leftButtonReleased()) {
                  this.scene.grid.tileMap.placeDirtTile(col, row);
                }
                break;
              case "concrete":
                if (pointer.leftButtonReleased()) {
                  this.scene.grid.tileMap.placeConcreteTile(col, row);
                }
                break;
            }
          }
        }
        this.selection.remove();
      }
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

        // Calculate the new camera position
        let newScrollX = camera.scrollX - dx;
        let newScrollY = camera.scrollY - dy;

        // Ensure the camera does not go out of bounds
        newScrollX = Phaser.Math.Clamp(
          newScrollX,
          0,
          this.scene.colCount * CELL_SIZE - camera.width
        );
        newScrollY = Phaser.Math.Clamp(
          newScrollY,
          0,
          this.scene.rowCount * CELL_SIZE - camera.height
        );

        // Set the new camera position
        camera.scrollX = newScrollX;
        camera.scrollY = newScrollY;
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
