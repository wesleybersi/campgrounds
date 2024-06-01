import { Blueprint } from "./force/Builder/tasks/Blueprint";
import { Forester } from "./force/Forester/Forester";
import { Builder } from "./force/Builder/Builder";
import { CutWood } from "./force/Forester/tasks/CutWood";
import { PlantTree } from "./force/Forester/tasks/PlantTree";
import { CutStone } from "./force/Forester/tasks/CutStone";

export type TaskType = CutWood | CutStone | PlantTree | Blueprint;
export type Worker = Builder | Forester;
