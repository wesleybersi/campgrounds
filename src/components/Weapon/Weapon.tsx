import styles from "./styles.module.scss";

interface Props {
  type: string;
  tier: string;
  icon: string;
  isSelected: boolean;
}
const Weapon: React.FC<Props> = ({ type, tier, icon, isSelected }) => {
  return (
    <main
      className={styles.weapon}
      style={{
        width: isSelected ? "10rem" : "10rem",
        outline: isSelected ? "5px solid white" : "",
      }}
    >
      <div>{tier}</div>
    </main>
  );
};

export default Weapon;
