import { absolutePos, oneIn } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";
import { CELL_SIZE } from "../../../../constants";

export class Nature {
  scene: MainScene;
  grassMap = new Map<string, Phaser.GameObjects.Rectangle>();
  constructor(scene: MainScene) {
    this.scene = scene;
  }
  update(delta: number) {
    // if (oneIn(10)) {
    //   for (const [, grass] of this.grassMap) {
    //     grass.setScale(grass.scale + 0.25);
    //   }
    //   const { col, row } = this.scene.grid.getRandomEmptyCell();
    //   const pos = `${col},${row}`;
    //   const cell = this.grassMap.get(pos);
    //   if (cell) {
    //     cell.setScale((cell.scale += 0.25));
    //     console.log("increase rect", col, row);
    //   } else {
    //     console.log("new rect", col, row);
    //     this.grassMap.set(
    //       pos,
    //       this.scene.add
    //         .rectangle(
    //           absolutePos(col),
    //           absolutePos(row),
    //           CELL_SIZE / 2,
    //           CELL_SIZE / 2,
    //           0x44bb44
    //         )
    //         .setDepth(absolutePos(row))
    //     );
    //   }
    // }
  }
}
