import ReactDOM from "react-dom/client";
import UI from "./App.tsx";
import Game from "./game/game.tsx";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>

  <>
    <Game />
    <UI />
  </>
  // </React.StrictMode>
);
