import styles from "./styles.module.scss";

interface Props {
  secondsAlive: number;
}
const Dead: React.FC<Props> = ({ secondsAlive }) => {
  return (
    <>
      <main className={styles.dead}>
        <h1>YOU DIED</h1>
        <h4>Time alive:</h4>
        <h4>{formatSeconds(secondsAlive)}</h4>
      </main>
    </>
  );
};

export default Dead;

function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minutesString =
    minutes > 0 ? `${minutes} ${minutes > 1 ? "minutes" : "minute"} and` : "";
  const secondsString = `${remainingSeconds} ${
    remainingSeconds > 1 ? "seconds" : "second"
  }`;

  return `${minutesString} ${secondsString}`;
}
