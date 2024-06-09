import MainScene from "../MainScene";
import { Flower } from "../entities/Grid/entities/Flower/Flower";
import { Tree } from "../entities/Grid/entities/Tree/Tree";

export default function update(this: MainScene, _: number, delta: number) {
  this.reactCallback(this);

  delta /= 1000;
  const staticDelta = delta;
  delta *= this.gameSpeed;
  this.delta = delta;

  //First update client state
  this.client.update(delta, staticDelta);
  if (this.gameSpeed === 0) return;
  //Then grid state
  this.grid.update(delta);

  //Then update and move all agents
  for (const agent of this.allAgents) {
    agent.update(delta);
  }
  //Then ready agents for next cycle
  // this.staff.update(delta);
  this.recreation.update(delta);

  console.log(this.staff.resourcesNotInStorage.size);

  const camera = this.cameras.main;
  this.frameCounter++;
  this.timeOfDay += this.gameSpeed;

  if (
    this.timeOfDay >= Math.floor(this.framesPerDay / 2) &&
    this.timeOfDay - this.gameSpeed < Math.floor(this.framesPerDay / 2)
  ) {
    this.isEvening = true;
  }

  if (this.timeOfDay >= this.framesPerDay) {
    //ANCHOR New day
    for (const row of this.grid.objectMatrix) {
      for (const obj of row) {
        if (obj instanceof Flower) {
          obj.grow();
        }
      }
    }

    for (const group of this.recreation.groups) {
      group.payment();
      let allTentsPitched = true;
      for (const tent of group.tents) {
        if (!tent.isPitched) {
          allTentsPitched = false;
        }
      }
      if (!allTentsPitched) continue;

      group.currentStay++;
      if (group.currentStay >= group.targetStay) {
        group.leave();
      }
    }

    console.count("new day");
    //ANCHOR New day
    this.timeOfDay = 0;
    this.isEvening = false;
    this.currentDay++;

    for (const agent of this.staff.workers) {
      agent.daysInService++;
    }
    for (const row of this.grid.objectMatrix) {
      for (const obj of row) {
        if (obj instanceof Tree) {
          obj.grow();
        }
      }
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
