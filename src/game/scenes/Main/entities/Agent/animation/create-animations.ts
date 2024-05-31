import { Agent } from "../Agent";

export function createAnimations(this: Agent) {
  this.anims.create({
    key: "idle",
    frames: [{ key: "agent", frame: 0 }],
    frameRate: 1,
    repeat: -1,
  });

  this.anims.create({
    key: "moving-down",
    frames: this.anims.generateFrameNumbers("agent", { start: 0, end: 7 }),
    frameRate: 12,
    repeat: -1,
  });

  this.anims.create({
    key: "moving-up",
    frames: this.anims.generateFrameNumbers("agent", { start: 8, end: 15 }),
    frameRate: 12,
    repeat: -1,
  });
  this.anims.create({
    key: "moving-horz",
    frames: this.anims.generateFrameNumbers("agent", { start: 16, end: 23 }),
    frameRate: 12,
    repeat: -1,
  });
}
