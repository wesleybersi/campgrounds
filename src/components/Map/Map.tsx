import { useEffect } from "react";
import styles from "./styles.module.scss";

interface Props {
  rows: number;
  cols: number;
  positions: { x: number; y: number; color: string; isClient?: boolean }[];
}

const Map: React.FC<Props> = ({ rows, cols, positions }) => {
  useEffect(() => {}, []);

  return (
    <section className={styles.wrapper}>
      <div className={styles.map} style={{ aspectRatio: `${cols} / ${rows}` }}>
        {positions.map(() => (
          <div>dot</div>
        ))}
      </div>
    </section>
  );
};

export default Map;
