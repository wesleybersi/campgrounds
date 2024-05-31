import { Blueprint } from "./force/Builder/tasks/Blueprint";
import { Forester } from "./force/Forester/Forester";
import { Builder } from "./force/Builder/Builder";
import { Woodcutting } from "./force/Forester/tasks/Woodcutting";

export type TaskType = Woodcutting | Blueprint;
export type Worker = Builder | Forester;
