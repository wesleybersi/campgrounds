import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { InventoryItem } from "../../../../App";

interface Props {
  item: InventoryItem | null;
  isSelected: boolean;
  index?: number;
}

const Item: React.FC<Props> = ({ index, item, isSelected }) => {
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    if (item && item.durability !== undefined) {
      const index = 20 - Math.floor(item.durability / 5);

      setColor(durabilityColors[index]);
    }
  }, [item]);

  return (
    <main
      className={styles.item}
      style={{
        width: isSelected ? "5rem" : "5rem",
        height: isSelected ? "5rem" : "5rem",
        transform: isSelected ? "scale(1.15)" : "scale(1)",
        backgroundColor: isSelected ? "#1F5481" : "var(--bg)",
      }}
      onDrop={() => setColor("gold")}
    >
      {item ? (
        <>
          {/* {isSelected && <div className={styles.name}>{item.name}</div>} */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: item.durability !== undefined ? "0.75rem" : "0",
              fontSize: "0.75rem",
              textAlign: "center",
            }}
          >
            {/* <IconPotion size="80%" color={"white"} /> */}
            {item.key}
          </div>
          {index && <span className={styles.index}>{index}</span>}
          {item.durability !== undefined && (
            <div className={styles.durability}>
              <span
                className={styles.current}
                style={{
                  height: `${item.durability}%`,
                  backgroundColor: color,
                }}
              ></span>
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </main>
  );
};

export default Item;

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
