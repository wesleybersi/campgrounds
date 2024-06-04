import MainScene from "../../../../../MainScene";

export interface Controller {
  [key: string]: {
    selectionType: "free" | "grid" | "grid-empty" | "line" | "none";
    onPointerUp?: (
      scene: MainScene,
      pointer: Phaser.Input.Pointer,
      cells: { col: number; row: number }[]
    ) => void;
    onPointerDown?: (
      scene: MainScene,
      pointer: Phaser.Input.Pointer,
      col: number,
      row: number
    ) => void;
  };
}
