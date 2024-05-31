// import MainScene from "../../../MainScene";
// import { CELL_SIZE } from "../../../constants";
// import { Tree } from "../../Grid/entities/Tree/Tree";
// import { Wall } from "../../Grid/entities/Wall/Wall";
// import { Builder } from "../force/Builder/Builder";

// //Task types
// //Harvesting - Building - Carrying

// export class Plant extends Phaser.GameObjects.Rectangle {
//   scene: MainScene;

//   col: number;
//   row: number;
//   type: "tree";
//   tier: "regular";
//   price: number;
//   progress = 0;
//   speedMultiplier = 0.1;
//   worker: Builder | null = null;
//   isCompleted = false;
//   constructor(
//     scene: MainScene,
//     type: "tree",
//     tier: "regular",
//     col: number,
//     row: number
//   ) {
//     super(
//       scene,
//       col * CELL_SIZE + CELL_SIZE / 2,
//       row * CELL_SIZE + CELL_SIZE / 2,
//       CELL_SIZE,
//       CELL_SIZE
//     );
//     this.setStrokeStyle(CELL_SIZE / 8, 0x345c0b);

//     this.scene = scene;
//     this.col = col;
//     this.row = row;
//     this.type = type;
//     this.tier = tier;
//     this.price = 25;

//     this.setDepth(20);
//     this.scene.labour.queuedTasks.push(this);
//     this.scene.grid.objectMatrix[row][col] = this;
//     this.scene.add.existing(this);
//   }
//   build(delta: number) {
//     this.progress += delta * this.speedMultiplier;

//     if (this.progress >= 1) {
//       //TODO Drop loot, agents now have to carry to storage
//       this.isCompleted = true;
//       new Tree(this.scene.grid);
//       this.remove();
//     }
//   }
//   remove() {
//     if (this.worker) {
//       this.worker.task = null;

//       const set = this.scene.grid.tracker[this.row][this.col];
//       for (const agent of set) {
//         if (agent instanceof Builder) {
//           agent.findEmptyCell();
//         }
//       }
//     }
//     const index = this.scene.labour.queuedTasks.indexOf(this);
//     this.scene.labour.queuedTasks.splice(index, 1);
//     if (this.scene.grid.objectMatrix[this.row][this.col] === this) {
//       this.scene.grid.objectMatrix[this.row][this.col] = null;
//     }
//     this.destroy();
//   }
// }
