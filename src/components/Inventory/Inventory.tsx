import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import DragItem from "./components/DragItem/DragItem";

import { InventoryItem } from "../../App";
import socket from "../../game/socket";

interface Props {
  itemSlots: (InventoryItem | null)[][];
  size: { rows: number; cols: number };
  selectedSlot: { row: number; col: number } | null;
}
const Inventory: React.FC<Props> = ({ itemSlots, size, selectedSlot }) => {
  const [dragIndex, setDragIndex] = useState<number>(-1);
  const [dragOverIndex, setDragOverIndex] = useState<number>(-1);

  useEffect(() => {
    console.log(itemSlots);
  }, [itemSlots]);

  return (
    <>
      {dragIndex >= 0 && <DragItem />}
      <main className={styles.inventory}>
        <h3>Inventory</h3>
        <div className={styles.combiner}>
          <div>
            <div
              className={styles.grid}
              style={{ gridTemplateColumns: `repeat(${size.rows},1fr)` }}
            >
              {itemSlots.map((row, y) =>
                row.map((item, x) => {
                  const index = y * size.rows + x;
                  const isFilled = item ? true : false;
                  const isBeingDragged = dragIndex === y * size.rows + x;
                  const isSelected =
                    selectedSlot &&
                    selectedSlot.row === y &&
                    selectedSlot.col === x;
                  return (
                    <div
                      draggable={isFilled ? true : false}
                      className={styles.item}
                      style={{
                        opacity: isBeingDragged ? 1 : 1,
                        backgroundColor:
                          isFilled && isSelected ? "#1F5481" : "var(--bg)",
                        border:
                          dragOverIndex === index ? "2px solid white" : "",
                      }}
                      onDragEnd={() => setDragIndex(-1)}
                      onDragStart={(e) => {
                        if (!isFilled) return;
                        // e.dataTransfer.effectAllowed = "none";
                        // e.preventDefault();
                        if (
                          !selectedSlot ||
                          (selectedSlot &&
                            (selectedSlot.row !== y || selectedSlot.col !== x))
                        ) {
                          socket.emit("Select Inventory Item", y, x);
                        }
                        const img = new Image();
                        img.src =
                          "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
                        e.dataTransfer.setDragImage(img, 0, 0);
                        setDragIndex(index);
                      }}
                      onDragExit={() => setDragOverIndex(-1)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverIndex(index);
                      }}
                      onDrop={(event) => {
                        socket.emit("Move Inventory Item", y, x);

                        setDragOverIndex(-1);
                        setDragIndex(-1);
                      }}
                      onClick={() =>
                        isFilled && socket.emit("Select Inventory Item", y, x)
                      }
                    >
                      {!isBeingDragged && item?.key}
                      <div className={styles.amount}>{item && item.amount}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div
            className={styles.buttons}
            style={selectedSlot ? { opacity: 1 } : { opacity: 0.35 }}
          >
            <button
              onClick={() =>
                selectedSlot &&
                socket.emit(
                  "Use Inventory Item",
                  selectedSlot.row,
                  selectedSlot.col
                )
              }
            >
              Use
            </button>
            <button>Drop</button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Inventory;
