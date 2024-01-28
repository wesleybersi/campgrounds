import styles from "./styles.module.scss";
import { RiCoinFill as IconCoin } from "react-icons/ri";

interface Props {
  name: string;
  color: string;
  health: number;
  floor: number;
  gold: number;
}
const Status: React.FC<Props> = ({ name, color, health, floor, gold }) => {
  return (
    <section className={styles.player}>
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          className={styles.item}
          style={{
            minWidth: "250px",
            minHeight: "2.75rem",
            background: index === 0 ? color : "",
            marginRight: `calc(250px + ${index * 16}px)`,
          }}
        >
          {index === 0 && (
            <div
              style={{
                display: "flex",
                gap: "1rem",
                fontSize: "1.25rem",
                fontWeight: 600,
              }}
            >
              <span className={styles.transcolor}>
                <span
                  className={styles.inner}
                  style={{
                    backgroundColor: color,
                  }}
                />
              </span>
              <span>{name}</span>
            </div>
          )}
          {index === 1 && (
            <div style={{ display: "flex", gap: "2rem" }}>
              <span className={styles.transcolor}>
                <span className={styles.inner} />
              </span>
              <span>Health: {health}</span>
              <span>
                <IconCoin size="18" color="gold" /> {gold}
              </span>
              <span>-{floor}F</span>
            </div>
          )}
          {/* {index === 2 && (
        <button
          style={{ pointerEvents: "all" }}
          onClick={() => socket.emit("Random Position Request")}
        >
          Random
        </button>
      )} */}
        </div>
      ))}
    </section>
  );
};

export default Status;
