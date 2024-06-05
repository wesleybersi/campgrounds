import styles from "./styles.module.scss";
import useStore from "../../store/store";
import { useEffect, useRef, useState } from "react";
import { MdForest as IconForesting } from "react-icons/md";
import { IoConstruct as IconConstruction } from "react-icons/io5";
import { TfiLayoutGrid3Alt as IconAreas } from "react-icons/tfi";
import { MdTour as IconTours } from "react-icons/md";

import Foresting from "./menu/Foresting/Foresting";
import Areas from "./menu/Areas/Areas";
import Construction from "./menu/Construction/Construction";
import TourGuide from "./menu/TourGuide/TourGuide";

const Toolbar = () => {
  const [bottomOffset, setBottomOffset] = useState<number>(0);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<number>(-1);
  const iconSize = "24px";
  const tools = [
    {
      name: "Areas",
      icon: <IconAreas size={iconSize} />,
      component: <Areas bottom={bottomOffset} />,
    },
    {
      name: "Foresting",
      icon: <IconForesting size={iconSize} />,
      component: <Foresting bottom={bottomOffset} />,
    },

    {
      name: "Building",
      icon: <IconConstruction size={iconSize} />,
      component: <Construction bottom={bottomOffset} />,
    },
    {
      name: "Tours",
      icon: <IconTours size={iconSize} />,
      component: <TourGuide bottom={bottomOffset} />,
    },
  ];

  useEffect(() => {
    //Calculates where the menu components need to mount
    if (!toolbarRef.current) return;
    const halfRem = 8;
    setBottomOffset(
      window.innerHeight - toolbarRef.current.offsetTop + halfRem
    );
  }, [toolbarRef.current]);

  return (
    <>
      <div className={styles.wrapper} ref={toolbarRef}>
        {tools.map(({ name, icon }, index) => (
          <button
            className={styles.button}
            tabIndex={-1}
            style={
              selected === index
                ? { backgroundColor: "var(--btn-selected-color)" }
                : { backgroundColor: "var(--btn-color)" }
            }
            onClick={() => setSelected(index === selected ? -1 : index)}
          >
            {icon}
          </button>
        ))}
      </div>
      {selected >= 0 && tools[selected].component}
    </>
  );
};

export default Toolbar;
