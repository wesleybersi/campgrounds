import { Blueprint } from "../Labour/force/Builder/tasks/Blueprint";
import { Tree } from "./entities/Tree/Tree";
import { Wall } from "./entities/Wall/Wall";
import { Rock } from "./entities/Rock/Rock";

export type StaticObject = Tree | Wall | Blueprint | Rock;
