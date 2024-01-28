import styles from "./styles.module.scss";

interface Props {
  dialog: { name: string; text: string[] };
}
const Dialog: React.FC<Props> = ({ dialog }) => {
  return (
    <section className={styles.message}>
      <div>
        <h3>{dialog.name}</h3>
      </div>
      <div>
        {dialog.text.map((paragraph) => (
          <p>{paragraph}</p>
        ))}
      </div>
      <button>E</button>
    </section>
  );
};

export default Dialog;
