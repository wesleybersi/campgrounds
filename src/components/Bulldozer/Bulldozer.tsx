import useStore from "../../store/store";
import styles from "./styles.module.scss";
import { GiBulldozer as IconBulldozer } from "react-icons/gi";

const Bulldozer = () => {
  const { scene } = useStore();
  return (
    <div className={styles.wrapper}>
      <button
        style={
          scene.client.command.order === "bulldozer"
            ? { background: "#F6BF03", color: "#222" }
            : {}
        }
        onClick={() => {
          if (scene.client.command.order === "bulldozer") {
            scene.client.command.clear();
          } else {
            scene.client.command.instruct("construction", "bulldozer");
          }
        }}
      >
        <IconBulldozer size="40px" />
      </button>
    </div>
  );
};

export default Bulldozer;
