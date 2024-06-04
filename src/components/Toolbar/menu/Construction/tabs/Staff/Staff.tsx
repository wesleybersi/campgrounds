import styles from "./styles.module.scss";
import useStore from "../../../../../../store/store";
import { CgMathPlus as IconHire } from "react-icons/cg";

const Staff = () => {
  const { scene } = useStore();
  return (
    <section className={styles.staff}>
      <p>
        Available:{" "}
        {scene.labour.builders.filter((builder) => !builder.task).length} /{" "}
        {scene.labour.builders.length}
      </p>
      <div className={styles.builders}>
        <button
          className={styles.profile}
          style={{ background: "var(--btn-color)" }}
          onClick={() => scene.labour.hire("builder")}
        >
          <IconHire size="24px" />
        </button>
        {scene.labour.builders.map((builder) => (
          <button
            className={styles.profile}
            onClick={() => builder.follow()}
            style={{ backgroundColor: builder.task ? "#ff0000cc" : "" }}
          ></button>
        ))}
      </div>
      <p>Build a forester's lodge to hire more foresters.</p>
    </section>
  );
};

export default Staff;
