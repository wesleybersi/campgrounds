import styles from "./styles.module.scss";
import useStore from "../../../../../../store/store";
import { CgMathPlus as IconHire } from "react-icons/cg";

const Staff = () => {
  const { scene } = useStore();
  return (
    <section className={styles.staff}>
      <p>
        Available: {scene.staff.guides.filter((guide) => !guide.task).length} /{" "}
        {scene.staff.guides.length}
      </p>
      <div className={styles.foresters}>
        <button
          className={styles.profile}
          style={{ background: "var(--btn-color)" }}
          onClick={() => scene.staff.hire("guide")}
        >
          <IconHire size="24px" />
        </button>
        {scene.staff.guides.map((guide) => (
          <button
            className={styles.profile}
            onClick={() => guide.follow()}
            style={{ backgroundColor: guide.task ? "#ff0000cc" : "" }}
          ></button>
        ))}
      </div>
      {/* <p>Build a forester's lodge to hire more foresters.</p> */}
    </section>
  );
};

export default Staff;
