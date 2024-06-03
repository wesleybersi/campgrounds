import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import useStore from "../../../../store/store";

import { GiScythe as IconHarvest } from "react-icons/gi";
import { CgMathPlus as IconHire } from "react-icons/cg";
import { FaTree as IconPlantTree } from "react-icons/fa";
import { LuFlower2 as IconPlantFlower } from "react-icons/lu";

import { MdClear as IconCancel } from "react-icons/md";

interface Props {
  bottom: number;
}

const Construction: React.FC<Props> = ({ bottom }) => {
  const { scene } = useStore();
  const tabs = [
    // {
    //   name: "Orders",
    // },
    {
      name: "Paths & Roads",
    },
    {
      name: "Basic Structures",
    },
    {
      name: "Recreation",
    },
    {
      name: "Signage",
    },
    // {
    //   name: "Facilities",
    // },
    // {
    //   name: "Utilities",
    // },
    { name: "Staff" },
  ];
  const [tabIndex, setTabIndex] = useState<number>(0);

  useEffect(() => {
    scene.client.order = "";
    return () => {
      // Run your cleanup code here
      scene.client.order = "";
    };
  }, [tabIndex]);

  return (
    <div className={styles.wrapper} style={{ bottom }}>
      <section>
        <h3>Construction</h3>
      </section>

      {tabIndex === 0 && (
        <section>
          <p>Place paths & roads</p>
          <div className={styles.orders}>
            <button
              style={{
                backgroundColor:
                  scene.client.order === "cancel" ? "#ffffff" : "",
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
                backgroundColor: scene.client.order === "dirt" ? "#ffffff" : "",
                color: scene.client.order === "dirt" ? "#000000" : "",
                width: "3rem",
                height: "3rem",
              }}
              onClick={() =>
                (scene.client.order =
                  scene.client.order === "dirt" ? "" : "dirt")
              }
            >
              {/* <IconHarvest size="24px" /> */}
              Dirt
            </button>
            <button
              style={{
                backgroundColor:
                  scene.client.order === "concrete" ? "#ffffff" : "",
                color: scene.client.order === "concrete" ? "#000000" : "",
                width: "3rem",
                height: "3rem",
              }}
              onClick={() =>
                (scene.client.order =
                  scene.client.order === "concrete" ? "" : "concrete")
              }
            >
              C
            </button>
            <button
              style={{
                backgroundColor:
                  scene.client.order === "floor planks" ? "#ffffff" : "",
                color: scene.client.order === "floor planks" ? "#000000" : "",
                width: "3rem",
                height: "3rem",
              }}
              onClick={() =>
                (scene.client.order =
                  scene.client.order === "floor planks" ? "" : "floor planks")
              }
            >
              Planks
            </button>
          </div>
        </section>
      )}
      {tabIndex === 1 && (
        <section>
          <p>Place basic structures like walls.</p>
          <div className={styles.orders}>
            <button
              style={{
                backgroundColor:
                  scene.client.order === "cancel" ? "#ffffff" : "",
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
                backgroundColor:
                  scene.client.order === "wooden wall" ? "#ffffff" : "",
                color: scene.client.order === "wooden wall" ? "#000000" : "",
                width: "3rem",
                height: "3rem",
              }}
              onClick={() =>
                (scene.client.order =
                  scene.client.order === "wooden wall" ? "" : "wooden wall")
              }
            >
              {/* <IconHarvest size="24px" /> */}
              Wood
            </button>
          </div>
        </section>
      )}
      {tabIndex === tabs.length - 1 && (
        <section>
          <p>
            Available:{" "}
            {scene.labour.foresters.filter((forester) => !forester.task).length}{" "}
            / {scene.labour.foresters.length}
          </p>
          <div className={styles.foresters}>
            <button
              className={styles.profile}
              style={{ background: "var(--btn-color)" }}
              onClick={() => scene.labour.hire("builder")}
            >
              <IconHire size="24px" />
            </button>
            {scene.labour.builders.map((builder) => (
              <button
                className={styles.profile}
                onClick={() => builder.follow()}
                style={{ backgroundColor: builder.task ? "#ff0000cc" : "" }}
              ></button>
            ))}
          </div>
          <p>Build a builders workshop to hire more builders.</p>
        </section>
      )}

      {tabIndex === 2 && (
        <section>
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
            Plant tree
          </button>
        </section>
      )}
      {tabIndex === 3 && <section></section>}

      <div className={styles.tabs}>
        {tabs.map(({ name }, index) => (
          <button
            style={
              tabIndex !== index
                ? {
                    backgroundColor: "#FFFFFF88",
                    color: "#222",
                    height: "1.25rem",
                  }
                : { fontWeight: 600 }
            }
            className={styles.tab}
            onClick={() => setTabIndex(index)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Construction;
