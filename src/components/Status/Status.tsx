import useStore from "../../store/store";
import styles from "./styles.module.scss";
import { MdGroups as IconGuests } from "react-icons/md";
import { RxComponentPlaceholder as IconSites } from "react-icons/rx";
import { BiHappyAlt as IconHappiness } from "react-icons/bi";
import { useState } from "react";
import OrderQueue from "./components/OrderQueue/OrderQueue";

const Status = () => {
  const { scene } = useStore();
  const [showOrders, setShowOrders] = useState<boolean>(false);
  return (
    <div className={styles.wrapper}>
      <section>
        <div>ƒ {scene.client.inventory.money},-</div>
        <div
          onMouseEnter={() => setShowOrders(true)}
          onMouseLeave={() => setShowOrders(false)}
        >
          {scene.staff.queuedTasks.length} orders
          {/* {showOrders && <OrderQueue />} */}
        </div>
        <div></div>
        <div></div>
      </section>
      <section>
        <input
          type="text"
          onChange={(event) => (scene.siteName = event.target.value)}
          value={scene.siteName}
        />
      </section>
      <section>
        <div className={styles.item}>
          <IconHappiness size="24px" /> 85%
        </div>
        <div className={styles.item}>
          <IconGuests size="24px" />
          {scene.recreation.guests.size}
        </div>
        <div className={styles.item}>
          <IconSites size="24px" />
          {
            Array.from(scene.recreation.sites).filter((site) => !site.occupants)
              .length
          }
          /{scene.recreation.sites.size}
        </div>
      </section>
    </div>
  );
};

export default Status;
