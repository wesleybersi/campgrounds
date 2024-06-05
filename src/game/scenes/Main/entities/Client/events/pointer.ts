import { Agent } from "http";
import { CELL_SIZE, MAX_ZOOM, MIN_ZOOM, ZOOM_FACTOR } from "../../../constants";
import { Guest } from "../../Recreation/entities/Guest/Guest";
import { Client } from "../Client";
import { Selection } from "../entities/Selection/Selection";

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
      if (this.keys.meta) return;

      if (!this.selection) {
        new Selection(
          this,
          pointer.worldX,
          pointer.worldY,
          pointer.leftButtonDown() ? "left" : "right"
        );
      }

      if (pointer.leftButtonDown()) {
        if (this.command && this.command.onPointerDown) {
          this.command.onPointerDown(
            this.scene,
            pointer,
            this.target.col,
            this.target.row
          );
        } else {
          //Selecting things

          this.scene.events.emit(
            `${this.target.col},${this.target.row}`,
            (agent: Agent) => {
              if (agent instanceof Guest) {
                console.log("Pong", agent);
              }
            }
          );
        }
      }
    });
  };

  const pointerUp = () => {
    this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (!this.scene.hasLoaded) {
        return;
      }
      if (this.selection?.button === "right") {
        const cells = this.selection.getSelectedTiles();
        for (const { col, row } of cells) {
          const taskInPlace = this.scene.staff.taskMatrix[row][col];

          if (taskInPlace) {
            taskInPlace.remove();
          }
        }
        this.selection.remove();
        return;
      }

      if (pointer.leftButtonReleased()) {
        if (this.command && this.command.onPointerUp) {
          let cells: { col: number; row: number }[] = [];
          if (this.selection) {
            cells = this.selection.getSelectedTiles();
          }
          this.command.onPointerUp(this.scene, pointer, cells);
        }
      }
      this.selection?.remove();
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
