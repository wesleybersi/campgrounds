import { Agent } from "../Agent";

export function createAnimations(this: Agent) {
  const framesPerPage = 16;
  const offset = this.characterIndex * framesPerPage;

  this.anims.create({
    key: "idle",
    frames: [{ key: "chars", frame: 0 + offset }],
    frameRate: 1,
    repeat: -1,
  });

  this.anims.create({
    key: "moving-down",
    frames: this.anims.generateFrameNumbers("chars", {
      start: 0 + offset,
      end: 3 + offset,
    }),
    frameRate: 12,
    repeat: -1,
  });

  this.anims.create({
    key: "moving-up",
    frames: this.anims.generateFrameNumbers("chars", {
      start: 8 + offset,
      end: 11 + offset,
    }),
    frameRate: 12,
    repeat: -1,
  });
  this.anims.create({
    key: "moving-left",
    frames: this.anims.generateFrameNumbers("chars", {
      start: 12 + offset,
      end: 15 + offset,
    }),
    frameRate: 12,
    repeat: -1,
  });
  this.anims.create({
    key: "moving-right",
    frames: this.anims.generateFrameNumbers("chars", {
      start: 4 + offset,
      end: 7 + offset,
    }),
    frameRate: 12,
    repeat: -1,
  });
}
