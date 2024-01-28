import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import DragItem from "./components/DragItem/DragItem";
import useMousePosition from "../../hooks/useMousePosition";

interface Props {
  inventory: {
    name: string;
    amount: number;
    durability?: number;
    icon?: string;
  }[];
}
const Inventory: React.FC<Props> = ({}) => {
  const { x, y } = useMousePosition();
  const [dragIndex, setDragIndex] = useState<number>(-1);

  useEffect(() => {
    function dragend() {
      setDragIndex(-1);
    }
    window.addEventListener("pointerup", dragend);
  }, []);

  return (
    <>
      <main className={styles.inventory}>
        <h3>Inventory</h3>
        <div className={styles.grid}>
          {Array.from({ length: 24 }).map((_, index) => (
            <div
              draggable
              className={styles.item}
              style={{ opacity: dragIndex === index ? 0.5 : 1 }}
              onDragStart={(e) => {
                e.preventDefault();
                setDragIndex(index);
              }}
            ></div>
          ))}
        </div>
      </main>
      {dragIndex >= 0 && <DragItem x={x} y={y} />}
    </>
  );
};

export default Inventory;
