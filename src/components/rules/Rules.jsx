import React from "react";

export const Rules = ({ setShowRules }) => {
  const closeRules = ({ target: { className } }) => {
    if (className === "rules" || className === "rules-button-close") {
      setShowRules(false);
    }
  };

  return (
    <div className="rules" onClick={closeRules}>
      <button className="rules-button-close">X</button>
      <div className="rules-div">
        <h2 className="rules-h2">How to play</h2>
        <p className="rules-p">
          You have to move the boxes to the blue points, you can only move the boxes by pushing forward.If you leave the
          box in a position where you cannot move it, you must restart the level{" "}
        </p>
      </div>
    </div>
  );
};
