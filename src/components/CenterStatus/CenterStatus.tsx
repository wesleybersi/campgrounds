import styles from "./styles.module.scss";

interface Props {
  health: number;
  force: number;
  floor: number;
}

const CenterStatus: React.FC<Props> = ({ health, force, floor }) => {
  return (
    <section className={styles.status}>
      <div className={styles.scores}>Floor: {floor}</div>
      <div className={styles.counter}>
        <div
          className={styles.current}
          style={{ width: health + "%", background: "green" }}
        ></div>
        <div className={styles.text}>{health}%</div>
      </div>
      {/* <div className={styles.armor}>
        <div
          className={styles.current}
          style={{ width: armor + "%", background: "#00599D" }}
        ></div>

      </div> */}
      <div className={styles.counter}>
        <div
          className={styles.current}
          style={{ width: force + "%", background: "#C12804" }}
        ></div>
      </div>
    </section>
  );
};

export default CenterStatus;
