import styles from "./App.module.scss";

import GameSpeed from "./components/GameSpeed/GameSpeed";
import Toolbar from "./components/Toolbar/Toolbar";
import Game from "./game/game";
import useStore from "./store/store";

function App() {
  const { set, scene } = useStore();

  return (
    <div className={styles.App}>
      <Game
        callback={(mainScene) => {
          set({ scene: mainScene });
        }}
      />
      {scene.hasLoaded && (
        <main>
          <Toolbar />
          <GameSpeed />
        </main>
      )}
    </div>
  );
}

export default App;
