import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import socket from "../../../game/socket";

interface Props {
  title: string;
  returnIndex: number;
}

const Customizer: React.FC<Props> = ({ title, returnIndex }) => {
  return (
    <div className={styles.customization}>
      <div className={styles.title}>{title}</div>
      <div className={styles.buttons}>
        <button
          style={{ background: "#00599D" }}
          onClick={() => socket.emit("Customize Bow", title, returnIndex - 1)}
        >
          -
        </button>
        {Array.from({ length: 5 }).map((_, index) => (
          <button
            style={{ background: index <= returnIndex ? "#00599D" : "" }}
            onClick={() => socket.emit("Customize Bow", title, index)}
          ></button>
        ))}
        <button
          style={{ background: "#00599D" }}
          onClick={() => socket.emit("Customize Bow", title, returnIndex + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Customizer;
