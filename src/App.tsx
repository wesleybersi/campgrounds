import { useState } from "react";
import styles from "./App.module.scss";

import GameSpeed from "./components/GameSpeed/GameSpeed";
import IntroMessage from "./components/IntroMessage/IntroMessage";
import Status from "./components/Status/Status";
import Toolbar from "./components/Toolbar/Toolbar";
import Game from "./game/game";
import useStore from "./store/store";
import Bulldozer from "./components/Bulldozer/Bulldozer";

function App() {
  const { set, scene } = useStore();
  const [showIntroMessage, setShowIntroMessage] = useState(true);

  return (
    <div className={styles.App}>
      <Game
        callback={(mainScene) => {
          set({ scene: mainScene });
        }}
      />

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
          <Bulldozer />
        </main>
      )}
    </div>
  );
}

export default App;
