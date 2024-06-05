import styles from "./styles.module.scss";
import useStore from "../../../../../../store/store";
import { CgMathPlus as IconHire } from "react-icons/cg";

const Staff = () => {
  const { scene } = useStore();

  const foresters = scene.staff.getWorkerType("forester");

  return (
    <section className={styles.staff}>
      <p>
        Available: {foresters.filter((forester) => !forester.taskQueue).length}{" "}
        / {foresters.length}
      </p>
      <div className={styles.foresters}>
        <button
          className={styles.profile}
          style={{ background: "var(--btn-color)" }}
          onClick={() => scene.staff.hire("forester")}
        >
          <IconHire size="24px" />
        </button>
        {foresters.map((forester) => (
          <button
            className={styles.profile}
            onClick={() => forester.follow()}
            style={{
              backgroundColor: forester.taskQueue.length > 0 ? "#ff0000cc" : "",
            }}
          ></button>
        ))}
      </div>
      <p>Build a forester's lodge to hire more foresters.</p>
    </section>
  );
};

export default Staff;
