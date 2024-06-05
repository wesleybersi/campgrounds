import styles from "./styles.module.scss";
import useStore from "../../../../store/store";
import { absolutePos } from "../../../../game/utils/helper-functions";

const OrderQueue = () => {
  const { scene } = useStore();
  return (
    <div className={styles.wrapper}>
      {scene.staff.queuedTasks.map((task) => (
        <div
          className={styles.orders}
          onMouseEnter={() =>
            scene.cameras.main.setScroll(
              absolutePos(task.col),
              absolutePos(task.row)
            )
          }
        >
          {task.laborType}
        </div>
      ))}
    </div>
  );
};

export default OrderQueue;
