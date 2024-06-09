import styles from "./styles.module.scss";
import useStore from "../../../../../../store/store";
import { GiScythe as IconHarvest } from "react-icons/gi";
import { GiGrass as IconMow } from "react-icons/gi";

import { useState } from "react";

const Orders = () => {
  const { scene } = useStore();
  const iconSize = "24px";

  const [selectionIndex, setSelectionIndex] = useState<number>(-1);
  const orders = [
    {
      name: "Harvest",
      description: [""],
      order: "harvest",
      icon: <IconHarvest size={iconSize} />,
    },
    {
      name: "Mow Grass",
      description: [""],
      order: "mow grass",
      icon: <IconMow size={iconSize} />,
    },
  ];

  return (
    <section className={styles.orders}>
      <p>
        Manage and sustain your campsite's forest through tree management,
        wildlife conservation, and more. Balance a environmental focus with
        visitor enjoyment to create a thriving wilderness destination.
      </p>
      {selectionIndex >= 0 && (
        <div>
          <h3>{orders[selectionIndex].name}</h3>
          {orders[selectionIndex].description.map((paragraph) => (
            <p>{paragraph}</p>
          ))}
        </div>
      )}

      <div className={styles.buttons}>
        {orders.map(({ order, icon }, index) => (
          <button
            style={{
              backgroundColor:
                scene.client.command.order === order ? "#ffffff" : "",
              color: scene.client.command.order === order ? "#000000" : "",
              width: "3rem",
              height: "3rem",
            }}
            onClick={() => {
              setSelectionIndex(
                scene.client.command.order === order ? -1 : index
              );
              if (scene.client.command.order === order) {
                scene.client.command.clear();
              } else {
                scene.client.command.instruct("foresting", order);
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

export default Orders;
