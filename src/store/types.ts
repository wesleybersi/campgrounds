import MainScene from "../game/scenes/Main/MainScene";

interface Store {
  scene: MainScene;
  set: (
    partial:
      | Store
      | Partial<Store>
      | ((state: Store) => Store | Partial<Store>),
    replace?: boolean | undefined
  ) => void;
}

export default Store;
