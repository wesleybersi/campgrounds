import useMousePosition from "../../../../hooks/useMousePosition";
import styles from "./styles.module.scss";

const DragItem: React.FC = () => {
  const { x, y } = useMousePosition();
  return (
    <div className={styles.item} style={{ top: y - 32, left: x - 32 }}></div>
  );
};

export default DragItem;
