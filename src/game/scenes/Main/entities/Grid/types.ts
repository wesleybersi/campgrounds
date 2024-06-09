import { Tree } from "./entities/Tree/Tree";
import { Wall } from "./entities/Wall/Wall";
import { Rock } from "./entities/Rock/Rock";
import { Hedge } from "./entities/Hedge/Hedge";
import { FloorPlanks } from "./entities/FloorPlanks/FloorPlanks";
import { Resource } from "../Resources/entities/Resource/Resource";
import { LawnMower } from "../Staff/entities/LawnMower/LawnMower";

export type StaticObject =
  | Tree
  | Wall
  | Rock
  | Hedge
  | FloorPlanks
  | Resource
  | LawnMower;
