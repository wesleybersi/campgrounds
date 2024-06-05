import styles from "./styles.module.scss";
import useStore from "../../../../../../store/store";
import { CgMathPlus as IconHire } from "react-icons/cg";

const Staff = () => {
  const { scene } = useStore();
  const builders = scene.staff.getWorkerType("builder");
  return (
    <section className={styles.staff}>
      <p>
        Available: {builders.filter((builder) => !builder.taskQueue).length} /{" "}
        {builders.length}
      </p>
      <div className={styles.builders}>
        <button
          className={styles.profile}
          style={{ background: "var(--btn-color)" }}
          onClick={() => scene.staff.hire("builder")}
        >
          <IconHire size="24px" />
        </button>
        {builders.map((builder) => (
          <button
            className={styles.profile}
            onClick={() => builder.follow()}
            style={{
              backgroundColor: builder.taskQueue.length > 0 ? "#ff0000cc" : "",
            }}
          ></button>
        ))}
      </div>
      <p>Build a forester's lodge to hire more foresters.</p>
    </section>
  );
};

export default Staff;
