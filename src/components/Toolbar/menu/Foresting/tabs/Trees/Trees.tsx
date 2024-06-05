import styles from "./styles.module.scss";
import useStore from "../../../../../../store/store";
import { GiScythe as IconHarvest } from "react-icons/gi";
import { FaTree as IconPlantTree } from "react-icons/fa";
import { LuFlower2 as IconPlantFlower } from "react-icons/lu";
import { FaGripLines as IconHedge } from "react-icons/fa6";
import { useEffect } from "react";

const Trees = () => {
  const { scene } = useStore();
  const iconSize = "24px";
  const orders = [
    {
      order: "plant tree",
      icon: <IconPlantTree size={iconSize} />,
    },
    {
      order: "plant tree",
      icon: <IconPlantTree size={iconSize} />,
    },
    {
      order: "plant tree",
      icon: <IconPlantTree size={iconSize} />,
    },
    {
      order: "plant tree",
      icon: <IconPlantTree size={iconSize} />,
    },
    {
      order: "plant tree",
      icon: <IconPlantTree size={iconSize} />,
    },
    {
      order: "plant tree",
      icon: <IconPlantTree size={iconSize} />,
    },
    {
      order: "plant tree",
      icon: <IconPlantTree size={iconSize} />,
    },
    {
      order: "plant tree",
      icon: <IconPlantTree size={iconSize} />,
    },
    {
      order: "plant tree",
      icon: <IconPlantTree size={iconSize} />,
    },
    {
      order: "plant tree",
      icon: <IconPlantTree size={iconSize} />,
    },
    {
      order: "plant tree",
      icon: <IconPlantTree size={iconSize} />,
    },
    {
      order: "plant tree",
      icon: <IconPlantTree size={iconSize} />,
    },
  ];

  useEffect(() => {
    return () => scene.client.command.clear();
  }, []);

  return (
    <section className={styles.orders}>
      <p>Select a tree and click anywhere to let a forester plant it.</p>
      <div className={styles.buttons}>
        {orders.map(({ order, icon }, index) => (
          <button
            style={{
              backgroundColor:
                scene.client.command.index === index ? "#ffffff" : "",
              color: scene.client.command.index === index ? "#000000" : "",
              width: "3rem",
              height: "3rem",
            }}
            onClick={() => {
              if (scene.client.command.index === index) {
                scene.client.command.clear();
              } else {
                scene.client.command.instruct("foresting", order, index);
              }
            }}
          >
            {icon}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Trees;
