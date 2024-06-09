import { Worker } from "../Worker";

export function getNewTask(this: Worker) {
  if (this.scene.staff.queuedTasks.length > 0) {
    const relevantTasks = this.scene.staff.queuedTasks.filter(
      (task) =>
        !task.worker && !task.isCompleted && task.laborType.includes(this.type)
    );

    const prioritySlice = 5;
    const prioritizedTasks = relevantTasks.slice(0, prioritySlice);

    if (prioritizedTasks.length > 0) {
      const nearestTask = prioritizedTasks.reduce((prev, curr) =>
        Math.abs(curr.row - this.row) + Math.abs(curr.col - this.col) <
        Math.abs(prev.row - this.row) + Math.abs(prev.col - this.col)
          ? curr
          : prev
      );
      nearestTask.assign(this);
      return true;
    }
  }
  return false;
}
