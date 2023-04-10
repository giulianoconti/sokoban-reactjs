import React from "react";
import ReactDOM from "react-dom/client";
import { Game } from "./components/Game";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
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
  </React.StrictMode>
);
