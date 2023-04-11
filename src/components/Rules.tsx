import boxImg from "/assets/box.png";
import playerImg from "/assets/player.png";

export const Rules = ({ setShowRules, gameScreenRef }: { setShowRules: (value: boolean) => void; gameScreenRef: React.RefObject<HTMLDivElement> }) => {
  const closeRules = () => {
    setShowRules(false);
    gameScreenRef.current?.focus();
  };

  return (
    <>
      <div className="rules" onClick={closeRules}></div>
      <button className="rules-button-close" onClick={closeRules}>
        X
      </button>
      <div className="rules-div">
        <h2 className="rules-h2">How to play</h2>
        <div className="rules-p">
          You have to move the boxes <img className="rules-img" src={boxImg} alt="box" /> to the blue dots <span className="blue-goal" />, you can only move the
          boxes by pushing forward
          <img className="rules-img" src={playerImg} alt="box" style={{ rotate: "90deg" }} />
          <img className="rules-img" src={boxImg} alt="box" />. If you leave the box in a position where you cannot move it, you must restart the level. <br />
          <br />
          You move with the keyboard arrows or using the arrows that are enabled by clicking on the button
          <button className="rules-btn">Show Arrows To Move</button>
        </div>
      </div>
    </>
  );
};
