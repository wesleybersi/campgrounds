import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import socket from "./game/socket";
import Weapon from "./components/Weapon/Weapon";

import { GiPocketBow as IconBow } from "react-icons/gi";
import { GiCrossbow as IconCrossbow } from "react-icons/gi";
import { GiSpearFeather as IconSpear } from "react-icons/gi";
import { LuSword as IconSword } from "react-icons/lu";

import { IconType } from "react-icons";
import Dialog from "./components/Dialog/Dialog";
import Status from "./components/Status/Status";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import Inventory from "./components/Inventory/Inventory";
import CurrentFloor from "./components/CurrentFloor/CurrentFloor";
import Dead from "./components/Dead/Dead";
import { LargeNumberLike } from "crypto";

interface GameData {
  client: {
    name: string;
    health: number;
    gold: number;
    state: string;
    color: number;
    floor: number;
    secondsAlive: number;
    weaponry: { type: string; tier: string; durability: number }[];
    weaponIndex: number;
    projectiles: { arrows: number };

    dialog?: { name: string; text: string[] };
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

function UI() {
  const [player, setPlayer] = useState<{
    name: string;
    state: string;
    health: number;
    gold: number;
    floor: number;
    secondsAlive: number;
    color: string;
    weaponry: { type: string; tier: string; durability: number }[];
    weaponIndex: number;
    projectiles: { arrows: number };
    dialog?: { name: string; text: string[] };
  }>({
    health: 100,
    state: "",
    floor: 0,
    gold: 0,
    secondsAlive: 0,
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
    socket.on("Game State Update", (gameData: GameData) => {
      const { client } = gameData;
      setPlayer({
        name: client.name,
        state: client.state,
        health: client.health,
        gold: client.gold,
        floor: client.floor,
        color: numericColorToHex(client.color),
        weaponry: client.weaponry,
        secondsAlive: client.secondsAlive,
        weaponIndex: client.weaponIndex,
        projectiles: client.projectiles,
        dialog: client.dialog ?? undefined,
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
    <div className={styles.App} style={{ pointerEvents: "none" }}>
      {/* {currentFloor && (
        <div
          className={styles.floorEntry}
          onAnimationEnd={() => {
            setCurrentFloor(null);
          }}
        >
          <h1>-{currentFloor}F</h1>
        </div>
      )} */}
      {player.dialog && <Dialog dialog={player.dialog} />}
      {player.state === "dead" && <Dead secondsAlive={player.secondsAlive} />}

      <div className={styles.ui}>
        <Status
          name={player.name}
          color={player.color}
          health={player.health}
          floor={player.floor}
          gold={player.gold}
        />
        <Leaderboard leaderboard={leaderboard} />
        {player.state === "in-inventory" && <Inventory inventory={[]} />}
        {/* <section className={styles.timer}>
          <div className={styles.lang}>
            <img src={IconNL} alt="NL" />
          </div>

          <div className={styles.time}></div>
          <div className={styles.left}>
            <IconUsers size="24px" />
          </div>
        </section> */}

        <CurrentFloor floor={player.floor} />

        <section className={styles.weaponry}>
          {player.weaponry
            .slice(0, 4)
            .map(({ type, tier, durability }, index) => {
              let icon: IconType = IconBow;
              if (type === "Bow") {
                icon = IconBow;
              } else if (type === "Crossbow") {
                icon = IconCrossbow;
              } else if (type === "Spear") {
                icon = IconSpear;
              } else if (type === "Sword") {
                icon = IconSword;
              }
              return (
                <Weapon
                  index={index + 1}
                  type={type}
                  tier={tier}
                  durability={durability}
                  icon={icon}
                  isSelected={player.weaponIndex === index}
                />
              );
            })}
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

      {/* <Game /> */}
    </div>
  );
}

export default UI;

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
