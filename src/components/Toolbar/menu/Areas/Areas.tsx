import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import useStore from "../../../../store/store";

import { MdClear as IconClear } from "react-icons/md";
import { PiSignIn as IconReception } from "react-icons/pi";
import { FaBoxesStacked as IconStorage } from "react-icons/fa6";
import { GiWoodAxe as IconLodge } from "react-icons/gi";

interface Props {
  bottom: number;
}

const Areas: React.FC<Props> = ({ bottom }) => {
  const { scene } = useStore();
  const iconSize = "24px";
  const orders = [
    {
      order: "clear",
      icon: <IconClear size={iconSize} />,
    },
    // {
    //   order: "area",
    //   icon: <IconAreas size={iconSize} />,
    // },
    {
      order: "storage",
      icon: <IconStorage size={iconSize} />,
    },
    {
      order: "reception",
      icon: <IconReception size={iconSize} />,
    },
    {
      order: "forester's lodge",
      icon: <IconLodge size={iconSize} />,
    },
    // {
    //   order: "campsite",
    //   icon: <IconCampground size={iconSize} />,
    // },
  ];

  const [tabIndex, setTabIndex] = useState<number>(0);

  useEffect(() => {
    scene.client.command.clear();
    return () => {
      // Run your cleanup code here
      scene.client.command.clear();
    };
  }, [tabIndex]);

  return (
    <div className={styles.wrapper} style={{ bottom }}>
      <section>
        <h3>Designate Areas</h3>
      </section>

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
    </div>
  );
};

export default Areas;
