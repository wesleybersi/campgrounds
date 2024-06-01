import { create } from "zustand";
import Store from "./types";
import MainScene from "../game/scenes/Main/MainScene";

const useStore = create<Store>((set) => ({
  scene: { hasLoaded: false } as MainScene,
  set,
}));

export default useStore;
