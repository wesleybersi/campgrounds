import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { IconType } from "react-icons";

export type WeaponBonus = "durability-up" | "damage-up" | "velocity-up";
interface Props {
  index: number;
  type: string;
  tier: string;
  durability: number;
  icon: IconType;
  isSelected: boolean;
  bonus?: WeaponBonus;
}
const Weapon: React.FC<Props> = ({
  index,
  type,
  tier,
  durability,
  icon: Icon,
  isSelected,
}) => {
  const isBroken = durability <= 0;
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    const index = 20 - Math.floor(durability / 5);

    setColor(durabilityColors[index]);
  }, [durability]);

  return (
    <main
      className={styles.weapon}
      style={{
        width: isSelected ? "5rem" : "5rem",
        height: isSelected ? "5rem" : "5rem",
        transform: isSelected ? "scale(1.15)" : "scale(1)",
        backgroundColor: isSelected ? "#1F5481" : "var(--bg)",
      }}
    >
      {isSelected && <div className={styles.name}>{tier}</div>}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: "0.75rem",
        }}
      >
        <Icon size="80%" color={isBroken ? "#840a0a" : "white"} />
      </div>
      <span className={styles.index}>{index}</span>
      <div className={styles.durability}>
        <span
          className={styles.current}
          style={{
            height: `${durability}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </main>
  );
};

export default Weapon;

const durabilityColors = [
  "#7fa837",
  "#7fa837",
  "#7fa837",
  "#7fa837",
  "#7fa837",
  "#7fa837",
  "#7fa837",
  "#7fa837",
  "#7fa837",
  "#7fa837",
  "#7fa035",
  "#808f30",
  "#807e2b",
  "#816e26",
  "#815d22",
  "#824d1d",
  "#823c18",
  "#832b13",
  "#831b0f",
  "#840a0a",
];
