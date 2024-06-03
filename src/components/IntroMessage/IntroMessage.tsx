import styles from "./styles.module.scss";
import useStore from "../../store/store";

interface Props {
  dismiss: () => void;
}
const IntroMessage: React.FC<Props> = ({ dismiss }) => {
  return (
    <div className={styles.wrapper}>
      <section>
        <h3>Notice</h3>
        <p>
          This game is currently in a{" "}
          <span style={{ fontWeight: 600 }}>very</span> early pre-alpha state.
          There are tons of bugs, no tutorial and most of the ideas are still in
          my head.
        </p>
        <p>With that said. Happy camping!</p>
        <button onClick={dismiss}>I understand</button>
      </section>
    </div>
  );
};

export default IntroMessage;
