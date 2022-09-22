import React from "react";
import { Game } from "./components/game/Game";

export const App = () => {
  return (
    <div className="app">
      <Game />
      <footer className="footer">
        <span className="footer-span">
          Created by{" "}
          <a className="footer-a" href="https://www.linkedin.com/in/giulianoconti/">
            Giuliano Conti
          </a>
        </span>
      </footer>
    </div>
  );
};
