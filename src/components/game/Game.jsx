import React, { useEffect, useRef, useState } from "react";
import { Levels } from "../levels/Levels";

export const Game = () => {
  const [level, setLevel] = useState(0);
  const [test, setTest] = useState(77);
  const [levelContainer, setLevelContainer] = useState(JSON.parse(JSON.stringify(Levels[level])));
  const [arrayPositionsGoals, setArrayPositionsGoals] = useState([]);
  const [arrayPositionsBoxes, setArrayPositionsBoxes] = useState([]);

  const [imgDirection, setImgDirection] = useState("cell-player-ArrowUp");
  const [messageWinner, setMessageWinner] = useState("");

  const [showArrowButtons, setShowArrowButtons] = useState(false);
  const [pressedArrow, setPressedArrow] = useState(["", "", "", ""]);

  const gameScreenRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setPressedArrow(["", "", "", ""]);
    }, 100);
  }, [levelContainer]);

  useEffect(() => {
    setLevelContainer(JSON.parse(JSON.stringify(Levels[level])));
    setTest(test + 1);
  }, [level]);

  useEffect(() => {
    positionGoals();
    positionBoxes();
    gameScreenRef.current.focus();
  }, [test]);

  const positionGoals = () => {
    let goals = [];
    for (let i = 0; i < levelContainer.length; i++) {
      const row = levelContainer[i];
      let column = -1;
      row.forEach((element) => {
        column += 1;
        if (element === 4) {
          goals = [...goals, [i, column]];
        }
      });
    }
    setArrayPositionsGoals(goals);
  };

  const positionBoxes = () => {
    let boxes = [];
    for (let i = 0; i < levelContainer.length; i++) {
      const row = levelContainer[i];
      let column = -1;
      row.forEach((element) => {
        column += 1;
        if (element === 3) {
          boxes = [...boxes, [i, column]];
        }
      });
    }
    setArrayPositionsBoxes(boxes);
  };

  const positionPlayer = () => {
    const player = levelContainer.find((row) => row.find((cell) => cell === 7));
    const playerRow = levelContainer.indexOf(player);
    const playerColumn = player.indexOf(7);
    return [playerRow, playerColumn];
  };

  const nextPositionContentOfPlayer = (direction) => {
    const [playerRow, playerColumn] = positionPlayer();
    if (direction === "ArrowUp") {
      return levelContainer[playerRow - 1][playerColumn];
    }
    if (direction === "ArrowDown") {
      return levelContainer[playerRow + 1][playerColumn];
    }
    if (direction === "ArrowLeft") {
      return levelContainer[playerRow][playerColumn - 1];
    }
    if (direction === "ArrowRight") {
      return levelContainer[playerRow][playerColumn + 1];
    }
  };

  const movePlayer = (direction) => {
    const newLevelContainer = [...levelContainer];
    const [playerRow, playerColumn] = positionPlayer();
    if (direction === "ArrowUp") {
      newLevelContainer[playerRow][playerColumn] = 0;
      newLevelContainer[playerRow - 1][playerColumn] = 7;
    }
    if (direction === "ArrowDown") {
      newLevelContainer[playerRow][playerColumn] = 0;
      newLevelContainer[playerRow + 1][playerColumn] = 7;
    }
    if (direction === "ArrowLeft") {
      newLevelContainer[playerRow][playerColumn] = 0;
      newLevelContainer[playerRow][playerColumn - 1] = 7;
    }
    if (direction === "ArrowRight") {
      newLevelContainer[playerRow][playerColumn] = 0;
      newLevelContainer[playerRow][playerColumn + 1] = 7;
    }
    setLevelContainer(newLevelContainer);
  };

  const nextPositionContentOfBox = (direction) => {
    const [playerRow, playerColumn] = positionPlayer();
    if (direction === "ArrowUp") {
      return levelContainer[playerRow - 2][playerColumn];
    }
    if (direction === "ArrowDown") {
      return levelContainer[playerRow + 2][playerColumn];
    }
    if (direction === "ArrowLeft") {
      return levelContainer[playerRow][playerColumn - 2];
    }
    if (direction === "ArrowRight") {
      return levelContainer[playerRow][playerColumn + 2];
    }
  };

  const moveBox = (direction) => {
    const newLevelContainer = [...levelContainer];
    const [playerRow, playerColumn] = positionPlayer();
    if (direction === "ArrowUp") {
      newLevelContainer[playerRow - 1][playerColumn] = 3;
    } else if (direction === "ArrowDown") {
      newLevelContainer[playerRow + 1][playerColumn] = 3;
    } else if (direction === "ArrowLeft") {
      newLevelContainer[playerRow][playerColumn - 1] = 3;
    } else if (direction === "ArrowRight") {
      newLevelContainer[playerRow][playerColumn + 1] = 3;
    }
    setLevelContainer(newLevelContainer);
  };

  // | 0 = empty | 1 = wall | 3 = box | 4 = goal | 7 = player |
  const handleKeyDown = ({ key }) => {
    // ----------------------------
    const keyPressed = {
      ArrowUp: ["cell-player-ArrowUp", ["pressing", "", "", ""]],
      ArrowDown: ["cell-player-ArrowDown", ["", "pressing", "", ""]],
      ArrowLeft: ["cell-player-ArrowLeft", ["", "", "pressing", ""]],
      ArrowRight: ["cell-player-ArrowRight", ["", "", "", "pressing"]],
    };
    if (!Object.keys(keyPressed).includes(key)) return;

    const [direc, pressed] = keyPressed[key];
    setPressedArrow(pressed);
    setImgDirection(direc);
    // ----------------------------
    if (nextPositionContentOfPlayer(key) === 0 || nextPositionContentOfPlayer(key) === 4) {
      movePlayer(key);
    } else if (nextPositionContentOfPlayer(key) === 3) {
      if (nextPositionContentOfBox(key) === 0 || nextPositionContentOfBox(key) === 4) {
        movePlayer(key);
        moveBox(key);
      }
    }

    // ----------------------------
    const newArray = [...levelContainer];
    for (let i = 0; i < arrayPositionsGoals.length; i++) {
      setLevelContainer(newArray);
      if (levelContainer[arrayPositionsGoals[i][0]][arrayPositionsGoals[i][1]].valueOf() === 0) {
        newArray[arrayPositionsGoals[i][0]][arrayPositionsGoals[i][1]] = 4;
      }
    }

    // ----------------------------
    positionBoxes();
    if (JSON.stringify(arrayPositionsGoals) === JSON.stringify(arrayPositionsBoxes)) {
      setMessageWinner(`You win the level ${level + 1}!`);
    }
  };

  const selectLevel = ({ target: { value } }) => {
    setLevel(parseInt(value));
    setMessageWinner("");
  };

  const nextLevel = () => {
    setLevel(level + 1);
    setMessageWinner("");
  };

  const restartLevel = () => {
    setTest(test + 1);
    setMessageWinner("");
    setLevelContainer(JSON.parse(JSON.stringify(Levels[level])));
  };

  const restartGame = () => {
    setTest(0);
    setLevel(0);
    setMessageWinner("");
    setLevelContainer(JSON.parse(JSON.stringify(Levels[0])));
  };

  const handleShowHideArrowButtons = () => {
    setShowArrowButtons(!showArrowButtons);
  };

  return (
    <>
      {messageWinner && (
        <div className="message-winner">
          <div>
            <h3>{messageWinner}</h3>
            {level < Levels.length - 1 ? (
              <button className="btn" onClick={nextLevel}>
                Next Level
              </button>
            ) : (
              <>
                <h4>You win the Game!</h4>
                <button className="btn" onClick={restartGame}>
                  Restart Game
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <h1 className="title">Sokoban</h1>
      <div className="pb-2 between flex">
        <select className="btn" value={level} onChange={selectLevel}>
          {Levels.map((l, index) => (
            <option key={index} value={index}>
              Level {index + 1}
            </option>
          ))}
        </select>
        <button className="btn" onClick={restartLevel}>
          Restart Level
        </button>
      </div>

      <div className="game" ref={gameScreenRef} onKeyDown={handleKeyDown} tabIndex="-1">
        {levelContainer.map((row, rowIndex) => (
          <div className="flex" key={rowIndex}>
            {row.map((cell, cellIndex) => {
              if (cell === 0) return <div className="cell cell-empty cell-img" key={cellIndex} />;
              else if (cell === 1) return <div className="cell cell-wall cell-img" key={cellIndex} />;
              else if (cell === 3) return <div className="cell cell-box cell-img" key={cellIndex} />;
              else if (cell === 4) return <div className="cell cell-goal" key={cellIndex} />;
              else if (cell === 7) return <div className={`cell cell-img cell-player ${imgDirection}`} key={cellIndex} />;
            })}
          </div>
        ))}

      </div>
        {showArrowButtons ? (
          <div className="arrows-container">
            <div className="arrows">
              <button className={`btn-arrow ${pressedArrow[0]}`} onClick={() => handleKeyDown({ key: "ArrowUp" })}>
                ⬆
              </button>
            </div>
            <div className="arrows">
              <button className={`btn-arrow ${pressedArrow[2]}`} onClick={() => handleKeyDown({ key: "ArrowLeft" })}>
                ⬅
              </button>
              <button className={`btn-arrow ${pressedArrow[1]}`} onClick={() => handleKeyDown({ key: "ArrowDown" })}>
                ⬇
              </button>
              <button className={`btn-arrow ${pressedArrow[3]}`} onClick={() => handleKeyDown({ key: "ArrowRight" })}>
                ➡
              </button>
            </div>
            <div className="flex">
              <button className="btn" onClick={handleShowHideArrowButtons}>
                Hide Arrows To Move
              </button>
            </div>
          </div>
        ) : (
          <div className="flex">
            <button className="btn" onClick={handleShowHideArrowButtons}>
              Show Arrows To Move
            </button>
          </div>
        )}
    </>
  );
};
