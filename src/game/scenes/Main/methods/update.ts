import MainScene from "../MainScene";
import { Tree } from "../entities/Grid/entities/Tree/Tree";

export default function update(this: MainScene, _: number, delta: number) {
  if (!this.hasLoaded) return;
  this.reactCallback(this);
  if (this.gameSpeed === 0) return;

  delta /= 1000;
  delta *= this.gameSpeed;
  this.delta = delta;

  //First update client state
  this.client.update(delta);
  //Then grid state
  this.grid.update(delta);

  //Then update and move all agents
  for (const agent of this.allAgents) {
    agent.update(delta);
  }
  //Then ready agents for next cycle
  this.labour.update(delta);
  this.recreation.update(delta);

  const camera = this.cameras.main;
  this.frameCounter++;
  this.timeOfDay += this.gameSpeed;

  if (
    this.timeOfDay >= Math.floor(this.framesPerDay / 2) &&
    this.timeOfDay - this.gameSpeed < Math.floor(this.framesPerDay / 2)
  ) {
    console.count("ebening");
    this.isEvening = true;

    //Everyone goes to bed
    for (const guest of this.recreation.guests) {
      if (!guest.group.campsite) continue;
      // guest.goto(guest.group.campsite.x, guest.group.campsite.y);
      guest.enterTent();
    }

    for (const worker of this.labour.workers) {
      // worker.goHome();
    }
  }

  if (this.timeOfDay >= this.framesPerDay) {
    console.count("new day");
    //ANCHOR New day
    this.timeOfDay = 0;
    this.isEvening = false;
    this.currentDay++;

    for (const guest of this.recreation.guests) {
      if (!guest.group.campsite) continue;
      guest.exitTent();
    }

    for (const agent of this.labour.workers) {
      agent.daysInService++;
    }
    for (const row of this.grid.objectMatrix) {
      for (const obj of row) {
        if (obj instanceof Tree) {
          obj.grow();
        }
      }
    }

    for (const group of this.recreation.groups) {
      group.currentDuration++;
    }
  }

  if (this.frameCounter >= 60) {
    this.frameCounter %= 60;
  }

  camera.deadzone?.setSize(
    camera.worldView.width * 0.2,
    camera.worldView.height * 0.05
  );
}
