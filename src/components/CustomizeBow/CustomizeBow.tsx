import Customizer from "./components/Customizer";
import styles from "./styles.module.scss";

interface Props {
  customizeBow: {
    drawSpeed: number;
    velocity: number;
    accuracy: number;
  };
}
const CustomizeBow: React.FC<Props> = ({ customizeBow }) => {
  return (
    <section className={styles.customize}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p>Customize Bow</p>
        <p>
          (
          {6 -
            Object.values(customizeBow).reduce(
              (acc, current) => acc + current,
              0
            )}
          ) available
        </p>
      </div>
      <Customizer title={"Draw Speed"} returnIndex={customizeBow.drawSpeed} />
      <Customizer title={"Velocity"} returnIndex={customizeBow.velocity} />
      <Customizer title={"Accuracy"} returnIndex={customizeBow.accuracy} />
    </section>
  );
};

export default CustomizeBow;
