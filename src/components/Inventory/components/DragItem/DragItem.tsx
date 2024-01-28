import styles from "./styles.module.scss";

interface Props {
  x: number;
  y: number;
}
const DragItem = ({ x, y }) => {
  return <div className={styles.item} style={{ top: y, left: x }}></div>;
};

export default DragItem;
