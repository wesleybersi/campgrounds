import { useState } from "react";
import styles from "./App.module.scss";

import GameSpeed from "./components/GameSpeed/GameSpeed";
import IntroMessage from "./components/IntroMessage/IntroMessage";
import Status from "./components/Status/Status";
import Toolbar from "./components/Toolbar/Toolbar";
import Game from "./game/game";
import useStore from "./store/store";

function App() {
  const { set, scene } = useStore();
  const [showIntroMessage, setShowIntroMessage] = useState(true);
  // const lengthOfDay = scene.framesPerDay;
  // const phase = scene.timeOfDay;
  // const progress = phase / lengthOfDay;

  return (
    <div className={styles.App}>
      <Game
        callback={(mainScene) => {
          set({ scene: mainScene });
        }}
      />
      {/* <section
        className={styles.night}
        style={{ opacity: progress / 2 }}
      ></section> */}

      {scene.hasLoaded && (
        <main>
          {showIntroMessage && (
            <IntroMessage
              dismiss={() => {
                setShowIntroMessage(false);
              }}
            />
          )}
          <Status />
          <Toolbar />
          <GameSpeed />
        </main>
      )}
    </div>
  );
}

export default App;
