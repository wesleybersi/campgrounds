import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import useStore from "../../../../store/store";

import { GiScythe as IconHarvest } from "react-icons/gi";
import { CgMathPlus as IconHire } from "react-icons/cg";
import { FaTree as IconPlantTree } from "react-icons/fa";
import { PiFlowerFill as IconPlantFlower } from "react-icons/pi";

interface Props {
  bottom: number;
}

//Tabs
//Main info -->Foresters, Avaliable, Orders, Harvest
//Trees
//Bush
//Flowers
//Management --> Locked until forester's lodge

// Harvest tool --> Scythe
// Amount of foresters
// Hire forester
// Build forester's lodge
// Tree types
// Bush types
// Flower types

const Foresting: React.FC<Props> = ({ bottom }) => {
  const { scene } = useStore();
  const tabs = [
    {
      name: "Orders",
    },
    { name: "Staff" },
    // { name: "Trees" },
    // { name: "Flowers" },
  ];
  const [tabIndex, setTabIndex] = useState<number>(0);

  useEffect(() => {
    scene.client.placeMode = "";
    return () => {
      // Run your cleanup code here
      scene.client.placeMode = "";
    };
  }, [tabIndex]);

  return (
    <div className={styles.wrapper} style={{ bottom }}>
      <section>
        <h3>Foresting</h3>
      </section>

      {tabIndex === 0 && (
        <section>
          <p>
            Manage, nurture, and sustain your campsite's forest ecosystem
            through tree management, wildlife conservation and more. Balance
            environmental stewardship with visitor enjoyment to create a
            thriving wilderness destination.
          </p>
          <button
            style={{
              backgroundColor:
                scene.client.placeMode === "harvest" ? "#ffffff" : "",
              color: scene.client.placeMode === "harvest" ? "#000000" : "",
              width: "3rem",
              height: "3rem",
            }}
            onClick={() =>
              (scene.client.placeMode =
                scene.client.placeMode === "harvest" ? "" : "harvest")
            }
          >
            <IconHarvest size="24px" />
          </button>
          <button
            style={{
              backgroundColor:
                scene.client.placeMode === "plant tree" ? "#ffffff" : "",
              color: scene.client.placeMode === "plant tree" ? "#000000" : "",
              width: "3rem",
              height: "3rem",
            }}
            onClick={() =>
              (scene.client.placeMode =
                scene.client.placeMode === "plant tree" ? "" : "plant tree")
            }
          >
            <IconPlantTree size="24px" />
          </button>
          <button
            style={{
              backgroundColor:
                scene.client.placeMode === "plant flower" ? "#ffffff" : "",
              color: scene.client.placeMode === "plant flower" ? "#000000" : "",
              width: "3rem",
              height: "3rem",
            }}
            onClick={() =>
              (scene.client.placeMode =
                scene.client.placeMode === "plant flower" ? "" : "plant flower")
            }
          >
            <IconPlantFlower size="24px" />
          </button>
        </section>
      )}
      {tabIndex === 1 && (
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
              onClick={() => scene.labour.hire("forester")}
            >
              <IconHire size="24px" />
            </button>
            {scene.labour.foresters.map((forester) => (
              <button
                className={styles.profile}
                onClick={() => forester.follow()}
                style={{ backgroundColor: forester.task ? "#ff0000cc" : "" }}
              ></button>
            ))}
          </div>
          <p>Build a forester's lodge to hire more foresters.</p>
        </section>
      )}

      {tabIndex === 2 && (
        <section>
          <button
            style={{
              backgroundColor:
                scene.client.placeMode === "plant tree" ? "#ffffff" : "",
              color: scene.client.placeMode === "plant tree" ? "#000000" : "",
              width: "3rem",
              height: "3rem",
            }}
            onClick={() =>
              (scene.client.placeMode =
                scene.client.placeMode === "plant tree" ? "" : "plant tree")
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

export default Foresting;
