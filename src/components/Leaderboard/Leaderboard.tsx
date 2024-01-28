import styles from "./styles.module.scss";

interface Props {
  leaderboard: {
    name: string;
    color: string;
    score: number;
    floor: number;
    secondsAlive: number;
  }[];
}

const Leaderboard: React.FC<Props> = ({ leaderboard }) => {
  return (
    <section className={styles.leaderboard}>
      {leaderboard.map(
        ({ name, color, floor, secondsAlive }, index) =>
          secondsAlive > 0 && (
            <div
              className={styles.item}
              style={{
                minWidth: "265px",
                marginLeft: `calc(250px + ${index * 16}px)`,
              }}
            >
              <span
                className={styles.color}
                style={{ background: color }}
              ></span>
              <span className={styles.position}>{index + 1}</span>
              {/* <span>{floor}F</span> */}
              <span>{name}</span>
              <span className={styles.score}>
                {formatSeconds(secondsAlive)}
              </span>
            </div>
          )
      )}
    </section>
  );
};

export default Leaderboard;

function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minutesString = minutes > 0 ? `${minutes}m` : "";
  const secondsString = `${remainingSeconds}s`;

  return `${minutesString} ${secondsString}`;
}
