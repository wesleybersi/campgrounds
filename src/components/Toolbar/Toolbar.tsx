import styles from "./styles.module.scss";
import useStore from "../../store/store";
import { useEffect, useRef, useState } from "react";
import { MdForest as IconForesting } from "react-icons/md";
import { IoConstruct as IconConstruction } from "react-icons/io5";
import { TfiLayoutGrid3Alt as IconAreas } from "react-icons/tfi";
import Foresting from "./menu/Foresting/Foresting";

const Toolbar = () => {
  const [menuBottomPosition, setMenuBottomPosition] = useState<number>(0);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<number>(-1);
  const iconSize = "24px";
  const tools = [
    {
      name: "Foresting",
      icon: <IconForesting size={iconSize} />,
      component: <Foresting bottom={menuBottomPosition} />,
    },

    { name: "Building", icon: <IconConstruction size={iconSize} /> },
    { name: "Areas", icon: <IconAreas size={iconSize} /> },
  ];

  useEffect(() => {
    //Calculates where the menu components need to mount
    if (!toolbarRef.current) return;
    const halfRem = 8;
    setMenuBottomPosition(
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
