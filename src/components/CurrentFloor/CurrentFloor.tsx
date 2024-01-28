// import { FaLongArrowAltUp as IconUp } from "react-icons/fa";
// import { FaLongArrowAltDown as IconDown } from "react-icons/fa";

import { HiArrowNarrowDown as IconDown } from "react-icons/hi";
import { HiArrowNarrowUp as IconUp } from "react-icons/hi";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

const CurrentFloor = ({ floor }: { floor: number }) => {
  const [prevFloor, setPrevFloor] = useState<number>(floor);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [animationKey, setAnimationKey] = useState<number>(0);
  const floorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setShow(true);

    if (prevFloor > floor) {
      setDirection("up");
    } else {
      setDirection("down");
    }
    setPrevFloor(floor);
    // Increment the animation key to trigger a re-render
    setAnimationKey((prevKey) => prevKey + 1);
  }, [floor]);

  return (
    <>
      {show && (
        <div
          key={animationKey}
          ref={floorRef}
          className={styles.floor}
          onAnimationEnd={() => setShow(false)}
        >
          {direction === "up" && <IconUp size="48px" color="#1F64CF" />}
          {direction === "down" && <IconDown size="48px" color="#BF0B25" />}-
          {floor}F
        </div>
      )}
    </>
  );
};

export default CurrentFloor;
