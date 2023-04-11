import React from "react";
import ReactDOM from "react-dom/client";
import { Game } from "./components/Game";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="app">
      <Game />
    </div>
  </React.StrictMode>
);
