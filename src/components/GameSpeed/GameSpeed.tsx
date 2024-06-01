import styles from "./styles.module.scss";
import useStore from "../../store/store";

import { IoPause as IconPause } from "react-icons/io5";
import { IoPlay as IconPlay } from "react-icons/io5";
import { IoPlayForward as IconFaster } from "react-icons/io5";
import { IoPlaySkipForward as IconFastest } from "react-icons/io5";
import { CELL_SIZE } from "../../game/scenes/Main/constants";

const GameSpeed = () => {
  const { scene } = useStore();
  const speeds = scene.gameSpeedValues;
  const iconSize = "24px";

  const lengthOfDay = scene.framesPerDay;
  const phase = scene.timeOfDay;
  const progress = (phase / lengthOfDay) * 100;

  const totalCells = scene.colCount * scene.rowCount;
  const aspectRatio = totalCells / scene.colCount;

  const icons = [
    <IconPause size={iconSize} />,
    <IconPlay size={iconSize} />,
    <IconFaster size={iconSize} />,
    <IconFastest size={iconSize} />,
  ];

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.map}
        style={{ width: "100%", aspectRatio: scene.colCount / scene.rowCount }}
      ></div>
      <div className={styles.speed}>
        {speeds.map((value, index) => (
          <button
            className={styles.button}
            tabIndex={-1}
            style={
              scene.gameSpeed === speeds[index]
                ? { backgroundColor: "var(--btn-selected-color)" }
                : { backgroundColor: "var(--btn-color)" }
            }
            onClick={() => scene.setSpeed(index)}
          >
            {icons[index]}
          </button>
        ))}
      </div>
      <div className={styles.time}>
        <span style={{ width: progress }} />
        <p>{scene.currentDay}</p>
      </div>
    </div>
  );
};

export default GameSpeed;
