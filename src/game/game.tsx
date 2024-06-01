import { useRef, useEffect } from "react";

import * as Phaser from "phaser";
import MainScene, { createMainScene } from "./scenes/Main/MainScene";

import LoadingScene from "./scenes/Loading/LoadingScene";
import LandingScene from "./scenes/Landing/LandingScene";
import HUDScene from "./scenes/HUD/HudScene";

interface Props {
  callback: (scene: MainScene) => void;
}
const Game: React.FC<Props> = ({ callback }) => {
  const gameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config = {
      type: Phaser.WEBGL,
      width: "100%",
      height: "100%",
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      fullscreenTarget: document.documentElement,
      fullscreen: {
        resizeCameras: true,
      },
      zoom: window.devicePixelRatio,
      parent: "phaser-game",
      backgroundColor: "#3F963F",
      scene: [LandingScene, createMainScene(callback), LoadingScene, HUDScene],
      render: {
        antialias: true,
        pixelArt: true,
        roundPixels: true,
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      if (game) {
        game.destroy(true);
      }
    };
  }, [gameRef]);

  return <div ref={gameRef} id="phaser-game" />;
};

export default Game;
