import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import useStore from "../../../../store/store";

import Staff from "./tabs/Staff/Staff";
import Orders from "./tabs/Orders/Orders";
import Trees from "./tabs/Trees/Trees";
import Hedges from "./tabs/Hedges/Trees";

interface Props {
  bottom: number;
}

const Foresting: React.FC<Props> = ({ bottom }) => {
  const { scene } = useStore();
  const tabs = [
    {
      name: "Basic Orders",
      component: <Orders />,
    },
    {
      name: "Trees",
      component: <Trees />,
    },
    {
      name: "Hedges",
      component: <Hedges />,
    },
    {
      name: "Flowers",
      component: <Orders />,
    },

    { name: "Staff", component: <Staff /> },
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
        <h3>Foresting</h3>
      </section>

      {tabs[tabIndex].component}

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
