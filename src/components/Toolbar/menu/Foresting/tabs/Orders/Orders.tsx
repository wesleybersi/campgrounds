import styles from "./styles.module.scss";
import useStore from "../../../../../../store/store";
import { GiScythe as IconHarvest } from "react-icons/gi";

import { FaTree as IconPlantTree } from "react-icons/fa";
import { LuFlower2 as IconPlantFlower } from "react-icons/lu";

import { FaGripLines as IconHedge } from "react-icons/fa6";

import { MdClear as IconCancel } from "react-icons/md";

const Orders = () => {
  const { scene } = useStore();
  return (
    <section className={styles.orders}>
      <p>
        Manage and sustain your campsite's forest through tree management,
        wildlife conservation, and more. Balance a environmental focus with
        visitor enjoyment to create a thriving wilderness destination.
      </p>
      <div className={styles.buttons}>
        <button
          style={{
            backgroundColor: scene.client.order === "cancel" ? "#ffffff" : "",
            color: scene.client.order === "cancel" ? "#000000" : "",
            width: "3rem",
            height: "3rem",
          }}
          onClick={() =>
            (scene.client.order =
              scene.client.order === "cancel" ? "" : "cancel")
          }
        >
          <IconCancel size="24px" />
        </button>
        <button
          style={{
            backgroundColor: scene.client.order === "harvest" ? "#ffffff" : "",
            color: scene.client.order === "harvest" ? "#000000" : "",
            width: "3rem",
            height: "3rem",
          }}
          onClick={() =>
            (scene.client.order =
              scene.client.order === "harvest" ? "" : "harvest")
          }
        >
          <IconHarvest size="24px" />
        </button>
        <button
          style={{
            backgroundColor:
              scene.client.order === "plant tree" ? "#ffffff" : "",
            color: scene.client.order === "plant tree" ? "#000000" : "",
            width: "3rem",
            height: "3rem",
          }}
          onClick={() =>
            (scene.client.order =
              scene.client.order === "plant tree" ? "" : "plant tree")
          }
        >
          <IconPlantTree size="24px" />
        </button>
        <button
          style={{
            backgroundColor:
              scene.client.order === "plant flower" ? "#ffffff" : "",
            color: scene.client.order === "plant flower" ? "#000000" : "",
            width: "3rem",
            height: "3rem",
          }}
          onClick={() =>
            (scene.client.order =
              scene.client.order === "plant flower" ? "" : "plant flower")
          }
        >
          <IconPlantFlower size="24px" />
        </button>
        <button
          style={{
            backgroundColor: scene.client.order === "hedge" ? "#ffffff" : "",
            color: scene.client.order === "hedge" ? "#000000" : "",
            width: "3rem",
            height: "3rem",
          }}
          onClick={() =>
            (scene.client.order = scene.client.order === "hedge" ? "" : "hedge")
          }
        >
          <IconHedge size="24px" />
        </button>
      </div>
    </section>
  );
};

export default Orders;
