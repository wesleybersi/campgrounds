import styles from "./styles.module.scss";
import useStore from "../../../../../../store/store";
import { GiScythe as IconHarvest } from "react-icons/gi";
import { FaTree as IconPlantTree } from "react-icons/fa";

import { useEffect } from "react";

const Pathways = () => {
  const { scene } = useStore();
  const iconSize = "24px";
  const orders = [
    {
      order: "dirt",
      icon: <IconHarvest size={iconSize} />,
    },
    {
      order: "wooden planks",
      icon: <IconPlantTree size={iconSize} />,
    },
  ];

  useEffect(() => {
    return () => scene.client.command.clear();
  }, []);

  return (
    <section className={styles.orders}>
      <p>
        Manage and sustain your campsite's forest through tree management,
        wildlife conservation, and more. Balance a environmental focus with
        visitor enjoyment to create a thriving wilderness destination.
      </p>
      <div className={styles.buttons}>
        {orders.map(({ order, icon }) => (
          <button
            style={{
              backgroundColor:
                scene.client.command.order === order ? "#ffffff" : "",
              color: scene.client.command.order === order ? "#000000" : "",
              width: "3rem",
              height: "3rem",
            }}
            onClick={() => {
              if (scene.client.command.order === order) {
                scene.client.command.clear();
              } else {
                scene.client.command.instruct("construction", order);
              }
            }}
          >
            {/* {icon} */}
            {order.slice(0, 5)}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Pathways;
