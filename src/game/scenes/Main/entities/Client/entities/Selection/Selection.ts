import { CELL_SIZE } from "../../../../constants";
import { Client } from "../../Client";

export class Selection extends Phaser.GameObjects.Rectangle {
  client: Client;
  highlighted: { col: number; row: number; graphic: Phaser.GameObjects.Arc }[] =
    [];
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  } = { x: 0, y: 0, width: 0, height: 0 };
  constructor(client: Client, x: number, y: number) {
    super(client.scene, x, y, 1, 1);
    this.client = client;
    this.setStrokeStyle(2, 0xffffff);
    this.setFillStyle(0x7788ff);
    this.setAlpha(0.25);
    this.setDepth(100);
    this.client.selection = this;
    this.client.scene.add.existing(this);
    this.setOrigin(0, 0);
  }
  select(x: number, y: number) {
    const width = x - this.x;
    const height = y - this.y;
    this.setSize(width, height);
    console.log(this.x + width, this.y + height);
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
