import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import useStore from "../../../../store/store";

import { FaCampground as IconCampground } from "react-icons/fa";

import { MdClear as IconCancel } from "react-icons/md";
import { PiSignIn as IconReception } from "react-icons/pi";
import { FaBoxesStacked as IconStorage } from "react-icons/fa6";

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

const Areas: React.FC<Props> = ({ bottom }) => {
  const { scene } = useStore();
  const iconSize = "24px";
  const orders = [
    {
      order: "storage",
      icon: <IconStorage size={iconSize} />,
    },
    {
      order: "reception",
      icon: <IconReception size={iconSize} />,
    },
    {
      order: "campsite",
      icon: <IconCampground size={iconSize} />,
    },
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
        <h3>Designate Areas</h3>
      </section>

      {/* {tabIndex === 0 && ( */}
      <section>
        <p>
          Designate specific areas so guest and staff know where they have to
          go.
        </p>
        <div className={styles.orders}>
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
                scene.client.command.instruct("area", order);
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </section>
      {/* )} */}

      {/* {tabIndex === 2 && (
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
      {tabIndex === 3 && <section></section>} */}

      {/* <div className={styles.tabs}>
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
      </div> */}
    </div>
  );
};

export default Areas;
