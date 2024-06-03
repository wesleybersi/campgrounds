import styles from "./styles.module.scss";
import useStore from "../../../../../../store/store";
import { CgMathPlus as IconHire } from "react-icons/cg";

const Staff = () => {
  const { scene } = useStore();
  return (
    <section className={styles.staff}>
      <p>
        Available:{" "}
        {scene.labour.foresters.filter((forester) => !forester.task).length} /{" "}
        {scene.labour.foresters.length}
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
  );
};

export default Staff;
