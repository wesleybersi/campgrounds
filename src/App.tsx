import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import socket from "./game/socket";

import Dialog from "./components/Dialog/Dialog";
import Status from "./components/Status/Status";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import Inventory from "./components/Inventory/Inventory";
import CurrentFloor from "./components/CurrentFloor/CurrentFloor";
import Dead from "./components/Dead/Dead";
import HotKeys from "./components/HotKeys/HotKeys";
import Map from "./components/Map/Map";
import CenterStatus from "./components/CenterStatus/CenterStatus";
import CustomizeBow from "./components/CustomizeBow/CustomizeBow";

export type InventoryItem = {
  key: string;
  durability?: number;
  amount?: number;
  stacks?: number;
};

interface InitialData {
  id: string;
  size: {
    rows: number;
    cols: number;
  };
}
interface GameData {
  client: {
    name: string;
    health: number;
    gold: number;
    state: string;
    force: number;
    color: number;
    floor: number;
    secondsAlive: number;
    weaponry: { type: string; tier: string; durability: number }[];
    projectiles: { arrows: number };
    inventory: {
      itemSlots: (InventoryItem | null)[][];
      size: { rows: number; cols: number };
      hotkeys: (InventoryItem | null)[];
      hotkeyIndex: number;
      selectedSlot: { row: number; col: number } | null;
    };
    dialog?: { name: string; text: string[] };
    bowCustomization: {
      drawSpeed: number; //0,1,2,3,4
      velocity: number;
      accuracy: number;
    };
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
    force: number;
    weaponry: { type: string; tier: string; durability: number }[];
    projectiles: { arrows: number };
    inventory: {
      itemSlots: (InventoryItem | null)[][];
      size: { rows: number; cols: number };
      hotkeys: (InventoryItem | null)[];
      hotkeyIndex: number;
      selectedSlot: { row: number; col: number } | null;
    };
    dialog?: { name: string; text: string[] };
    bowCustomization: {
      drawSpeed: number; //0,1,2,3,4
      velocity: number;
      accuracy: number;
    };
  }>({
    health: 100,
    state: "",
    floor: 0,
    gold: 0,
    secondsAlive: 0,
    name: "",
    color: "",
    force: 0,
    weaponry: [],
    inventory: {
      itemSlots: [],
      size: { rows: 3, cols: 3 },
      hotkeys: [null, null, null, null, null],
      hotkeyIndex: 0,
      selectedSlot: null,
    },
    projectiles: { arrows: 0 },
    bowCustomization: {
      drawSpeed: 2, //0,1,2,3,4
      velocity: 2,
      accuracy: 2,
    },
  });

  const [isCustomize, setIsCustomize] = useState<boolean>(false);

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
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "c") {
        setIsCustomize((prev) => !prev);
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  });

  useEffect(() => {
    // socket.on("Initial Floor Data", (data: InitialData) => {});
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
        projectiles: client.projectiles,
        inventory: client.inventory,
        force: client.force,
        dialog: client.dialog ?? undefined,
        bowCustomization: client.bowCustomization,
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
    <div
      className={styles.App}
      style={{ pointerEvents: isCustomize ? "all" : "none" }}
    >
      <CenterStatus
        health={player.health}
        force={player.force * 100}
        floor={player.floor}
      />
      <Map rows={100} cols={150} positions={[]} />
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

      {isCustomize && <CustomizeBow customizeBow={player.bowCustomization} />}

      <div className={styles.ui}>
        {/* <Status
          name={player.name}
          color={player.color}
          health={player.health}
          floor={player.floor}
          gold={player.gold}
        /> */}
        <Leaderboard leaderboard={leaderboard} />
        {player.state === "in-inventory" && (
          <Inventory
            itemSlots={player.inventory.itemSlots}
            size={player.inventory.size}
            selectedSlot={player.inventory.selectedSlot}
          />
        )}
        {/* <HotKeys
          items={player.inventory.hotkeys}
          hotkeyIndex={player.inventory.hotkeyIndex}
        /> */}

        <section className={styles.weaponstatus}>
          {/* <div className={styles.force}>
            <div
              className={styles.weaponforce}
              style={{
                height: `${player.force * 100}%`,
                background: "#C12804",
              }}
              // style={{ height: "100%" }}
            ></div>
          </div> */}
          <div
            className={styles.weapon}
            style={{
              border:
                player.inventory.hotkeyIndex === 0 ? "white 2px solid" : "",
            }}
          >
            {player.inventory.hotkeys[0]?.key}
          </div>
          <div
            className={styles.weapon}
            style={{
              border:
                player.inventory.hotkeyIndex === 1 ? "white 2px solid" : "",
            }}
          >
            {player.inventory.hotkeys[1]?.key}
          </div>
          <div className={styles.projectiles}>
            <div className={styles.projectile}>{player.projectiles.arrows}</div>
            <div className={styles.projectile}></div>
            <div className={styles.projectile}></div>
            <div className={styles.projectile}></div>
            {/* <div className={styles.projectile}></div> */}
            {/* <div className={styles.projectile}></div> */}
          </div>
        </section>

        {/* <section className={styles.quiver}>
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
        </section> */}
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
