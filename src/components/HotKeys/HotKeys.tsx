import styles from "./styles.module.scss";
import { InventoryItem } from "../../App";
import Key from "../Key/Key";

interface Props {
  items: (InventoryItem | null)[];
  hotkeyIndex: number;
}

const HotKeys: React.FC<Props> = ({ items, hotkeyIndex }) => {
  return (
    <section className={styles.hotkeys}>
      {items.map((item, index) => {
        return (
          <Key
            item={item}
            index={index + 1}
            isSelected={index === hotkeyIndex}
          />
        );
      })}
    </section>
  );
};

export default HotKeys;
