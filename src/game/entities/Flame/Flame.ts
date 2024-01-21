// import { CELL_SIZE } from "../../../../../../socket-shooter 2/server/src/constants";
// import MainScene from "../../scenes/Main/MainScene";
// import { CELL_HEIGHT, CELL_WIDTH } from "../../scenes/Main/constants";
// import { clamp, randomNum } from "../../utils/helper-functions";

// export default class Flame extends Phaser.GameObjects.Sprite {
//   scene: MainScene;
//   row: number;
//   col: number;
//   constructor(scene: MainScene, row: number, col: number) {
//     super(
//       scene,
//       col * CELL_SIZE + CELL_SIZE / 2,
//       row * CELL_SIZE + CELL_SIZE / 2,
//       "smoke"
//     );
//     this.row = row;
//     this.col = col;
//     this.scene = scene;
//     this.scene.add.existing(this);

//     this.setDepth(row + 2);

//     this.scene.add.particles(this.x, this.y, "smoke", {
//       color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
//       colorEase: "quad.out",
//       lifespan: clamp(randomNum(400), 75, 400),
//       // angle: { min: -100, max: -80 },
//       alpha: { start: 0.5, end: 0.25, ease: "sine.out" },
//       scale: { start: 0.45, end: 0, ease: "sine.out" },
//       speed: 200,
//       advance: 5000,
//       blendMode: "ADD",
//       deathCallback: () => {
//         // this.emitter?.stop();
//       },
//     });
//   }
// }
