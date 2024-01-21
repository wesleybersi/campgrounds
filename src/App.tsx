import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import Game from "./game/game";
import socket from "./game/socket";
import IconNL from "./assets/icon-nl.png";
import { HiUsers as IconUsers } from "react-icons/hi";
import Weapon from "./components/Weapon/Weapon";

interface GameData {
  client: {
    name: string;
    health: number;
    color: number;
    floor: number;
    weaponry: { type: string; tier: string }[];
    weaponIndex: number;
    projectiles: { arrows: number };
  };
}
export interface GameIntervalData {
  timeRemaining: number;
  leaderboard: {
    name: string;
    color: number;
    score: number;
    floor: number;
    secondsAlive: number;
  }[];
}

function App() {
  const [gridSize, setGridSize] = useState<{ rows: number; cols: number }>({
    rows: 0,
    cols: 0,
  });
  const [player, setPlayer] = useState<{
    name: string;
    health: number;
    floor: number;
    color: string;
    weaponry: { type: string; tier: string }[];
    weaponIndex: number;
    projectiles: { arrows: number };
  }>({
    health: 100,
    floor: 0,
    name: "",
    color: "",
    weaponry: [],
    weaponIndex: 0,
    projectiles: { arrows: 0 },
  });

  const [timeRemaining, setTimeRemaining] = useState<number>();
  const [leaderboard, setLeaderboard] = useState<
    {
      name: string;
      color: string;
      score: number;
      floor: number;
      secondsAlive: number;
    }[]
  >([]);

  useEffect(() => {
    socket.on("Initial Game Data", (gameData) => {
      const rows = gameData.grid.rows;
      const cols = gameData.grid.cols;
      setGridSize({ rows, cols });
    });

    socket.on("Game State Update", (gameData: GameData) => {
      const { client } = gameData;
      setPlayer({
        name: client.name,
        health: client.health,
        floor: client.floor,
        color: numericColorToHex(client.color),
        weaponry: client.weaponry,
        weaponIndex: client.weaponIndex,
        projectiles: client.projectiles,
      });
    });

    socket.on("Game Interval Update", (data: GameIntervalData) => {
      const leaderboard = [];
      for (const player of data.leaderboard) {
        leaderboard.push({ ...player, color: numericColorToHex(player.color) });
      }
      setLeaderboard(leaderboard);
    });
  }, [socket]);

  return (
    <div className={styles.App}>
      <div className={styles.ui}>
        <section className={styles.player}>
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              className={styles.item}
              style={{
                minWidth: "250px",
                minHeight: "2.75rem",
                background: index === 0 ? player.color : "",
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
                        backgroundColor: player.color,
                      }}
                    />
                  </span>
                  <span>{player.name}</span>
                </div>
              )}
              {index === 1 && (
                <div style={{ display: "flex", gap: "2rem" }}>
                  <span className={styles.transcolor}>
                    <span className={styles.inner} />
                  </span>
                  <span>Health: {player.health}</span>
                  <span>-{player.floor}F</span>
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

        {/* <section className={styles.timer}>
          <div className={styles.lang}>
            <img src={IconNL} alt="NL" />
          </div>

          <div className={styles.time}>

          </div>
          <div className={styles.left}>
            <IconUsers size="24px" />

          </div>

        </section> */}
        <section className={styles.leaderboard}>
          {leaderboard
            .slice(0, 8)
            .map(({ name, color, floor, secondsAlive }, index) => (
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
                <span>{floor}F</span>
                <span>{name}</span>
                <span className={styles.score}>
                  {formatSeconds(secondsAlive)}
                </span>
              </div>
            ))}
        </section>
        {/* <section
          className={styles.map}
          style={{
            aspectRatio: `${gridSize.cols} / ${gridSize.rows}`,
            width: 200,
          }}
        >
          {positions.map((position) => {
            const isClient = position.id === playerData.id;
            return (
              <span
                style={{
                  display: "block",
                  position: "absolute",
                  top: `${(position.row / gridSize.rows) * 100}%`,
                  left: `${(position.col / gridSize.cols) * 100}%`,
                  width: isClient ? 8 : 3,
                  height: isClient ? 8 : 3,
                  borderRadius: "50%",
                  background: position.color,
                  transition: "128ms ease all",
                  // outline: isClient ? "1px solid rgba(255,255,255,0.75)" : "",
                }}
              ></span>
            );
          })}
        </section> */}
        <section className={styles.weaponry}>
          {player.weaponry
            // .slice(0, 3)
            .map(({ type, tier }, index) => (
              <Weapon
                type={type}
                tier={tier}
                icon={""}
                isSelected={player.weaponIndex === index}
              />
            ))}
        </section>
        <section className={styles.quiver}>
          <div
            style={{
              color:
                player.projectiles.arrows > 9
                  ? "green"
                  : greenToRed[player.projectiles.arrows],
            }}
          >
            {player.projectiles.arrows}
          </div>
        </section>
      </div>

      <Game />
    </div>
  );
}

export default App;

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

function numericColorToHex(colorValue: number) {
  // Ensure the input is a number and convert it to a hexadecimal string
  const hexString = colorValue.toString(16);

  // Add '0x' prefix and pad with zeros if necessary to ensure 6 characters
  const hexColor = `#${hexString.padStart(6, "0")}`;

  return hexColor;
}

const greenToRed = [
  "#ff0000",
  "#e30e00",
  "#c61c00",
  "#aa2b00",
  "#8e3900",
  "#714700",
  "#555500",
  "#396400",
  "#1c7200",
  "#008000",
];

function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minutesString = minutes > 0 ? `${minutes}m` : "";
  const secondsString = `${remainingSeconds}s`;

  return `${minutesString} ${secondsString}`;
}
