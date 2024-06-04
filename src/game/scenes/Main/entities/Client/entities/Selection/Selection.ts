import { CELL_SIZE } from "../../../../constants";
import { Client } from "../../Client";

export class Selection extends Phaser.GameObjects.Rectangle {
  client: Client;
  button: "left" | "right" = "left";
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  } = { x: 0, y: 0, width: 0, height: 0 };

  constructor(client: Client, x: number, y: number, button: "left" | "right") {
    super(client.scene, x, y, 1, 1);
    this.client = client;
    this.button = button;
    this.setStrokeStyle(2, 0xffffff);
    this.setFillStyle(0x7788ff);
    this.setAlpha(0.5);
    this.setDepth(this.client.scene.topDepth);
    this.client.selection = this;
    this.client.scene.add.existing(this);
    this.setOrigin(0, 0);
  }
  select(x: number, y: number, button: "left" | "right") {
    if (button === "left") {
      this.button = "left";
      switch (this.client.command.selectionType) {
        case "none":
          this.setSize(0, 0);
          break;
        case "free":
          {
            const width = x - this.x;
            const height = y - this.y;
            this.setSize(width, height);
            if (button === "left") {
              this.setStrokeStyle(1, 0xffffff);
              this.setFillStyle(0x7788ff);
              this.button = "left";
            }
          }
          break;
        case "line":
          break;
        case "grid":
          {
            const width = x - this.x;
            const height = y - this.y;
            this.setPosition(
              Math.floor(this.x / CELL_SIZE) * CELL_SIZE,
              Math.floor(this.y / CELL_SIZE) * CELL_SIZE
            );
            this.setSize(
              Math.ceil(width / CELL_SIZE) * CELL_SIZE - 1,
              Math.ceil(height / CELL_SIZE) * CELL_SIZE - 1
            );
          }
          break;
        case "grid-empty":
          {
            const width = x - this.x;
            const height = y - this.y;
            this.setPosition(
              Math.floor(this.x / CELL_SIZE) * CELL_SIZE,
              Math.floor(this.y / CELL_SIZE) * CELL_SIZE
            );
            this.setSize(
              Math.ceil(width / CELL_SIZE) * CELL_SIZE - 1,
              Math.ceil(height / CELL_SIZE) * CELL_SIZE - 1
            );
          }
          break;

        // switch (
      }
      // ) {
      // }
    } else if (button === "right") {
      this.button = "right";
      const width = x - this.x;
      const height = y - this.y;
      this.setSize(width, height);
      this.setStrokeStyle(1, 0xffffff);
      this.setFillStyle(0xff8888);
    }
  }
  getSelectedTiles() {
    const topLeft = {
      x: this.x + this.width < this.x ? this.x + this.width : this.x,
      y: this.y + this.height < this.y ? this.y + this.height : this.y,
    };
    const bottomRight = {
      x: this.x + this.width < this.x ? this.x : this.x + this.width,
      y: this.y + this.height < this.y ? this.y : this.y + this.height,
    };

    this.rect.x = topLeft.x;
    this.rect.y = topLeft.y;

    this.rect.width = bottomRight.x - topLeft.x;
    this.rect.height = bottomRight.y - topLeft.y;

    return this.selectTilesInRectangle(topLeft, bottomRight);
  }
  selectTilesInRectangle(
    topLeftPx: { x: number; y: number },
    bottomRightPx: { x: number; y: number }
  ): { col: number; row: number }[] {
    const selectedTiles: { col: number; row: number }[] = [];

    // Convert pixel coordinates to grid indices
    const topLeft = {
      x: Math.floor(topLeftPx.x / CELL_SIZE),
      y: Math.floor(topLeftPx.y / CELL_SIZE),
    };
    const bottomRight = {
      x: Math.floor(bottomRightPx.x / CELL_SIZE),
      y: Math.floor(bottomRightPx.y / CELL_SIZE),
    };

    // Iterate over the grid indices within the rectangle
    for (let row = topLeft.y; row <= bottomRight.y; row++) {
      for (let col = topLeft.x; col <= bottomRight.x; col++) {
        if (this.client.scene.grid.isWithinBounds(col, row)) {
          selectedTiles.push({ col, row });
        }
      }
    }

    return selectedTiles;
  }
  remove() {
    this.client.selection = null;
    this.destroy();
  }
}
