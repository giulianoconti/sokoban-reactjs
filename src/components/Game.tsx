import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { Levels } from "../levels/Levels";
import { Rules } from "./Rules";

type ArrowKey = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

export const Game = () => {
  const levelsCopy = JSON.parse(JSON.stringify(Levels));
  const gameScreenRef = useRef<HTMLDivElement>(null);
  const [arrayPositionsBoxes, setArrayPositionsBoxes] = useState<[number, number][]>([]);
  const [arrayPositionsGoals, setArrayPositionsGoals] = useState<[number, number][]>([]);
  const [hasWon, setHasWon] = useState(false);
  const [imgDirection, setImgDirection] = useState("cell-player-ArrowUp");
  const [level, setLevel] = useState<number>(0);
  const [levelContainer, setLevelContainer] = useState(levelsCopy[level] as number[][]);
  const [messageWinner, setMessageWinner] = useState("");
  const [showArrowButtons, setShowArrowButtons] = useState(false);
  const [showRules, setShowRules] = useState<boolean>(false);

  useEffect(() => {
    setLevelContainer(levelsCopy[level]);
    setHasWon(!hasWon);
  }, [level]);

  useEffect(() => {
    const theyAreEqual = arraysEqual(arrayPositionsGoals, arrayPositionsBoxes) && arrayPositionsGoals.length > 0 && arrayPositionsBoxes.length > 0;
    if (theyAreEqual) {
      setMessageWinner(`You won level ${level + 1}!`);
      gameScreenRef.current?.blur();
    }
  }, [arrayPositionsGoals, arrayPositionsBoxes]);

  useEffect(() => {
    positionBoxesOrGoals(4);
    positionBoxesOrGoals(3);
    gameScreenRef.current?.focus();
  }, [hasWon]);

  const arraysEqual = (arr1: [number, number][], arr2: [number, number][]) => {
    if (arr1 === arr2) {
      return true;
    }
    if (arr1 == null || arr2 == null) {
      return false;
    }
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i][0] !== arr2[i][0] || arr1[i][1] !== arr2[i][1]) {
        return false;
      }
    }
    return true;
  };

  // box = 3, goal = 4, player = 7
  const positionBoxesOrGoals = (boxOrGoal: 3 | 4) => {
    let boxesOrGoals: [number, number][] = [];
    for (let i = 0; i < levelContainer.length; i++) {
      const row = levelContainer[i];
      let column = -1;
      row.forEach((element) => {
        column += 1;
        if (element === boxOrGoal) {
          boxesOrGoals = [...boxesOrGoals, [i, column]];
        }
      });
    }

    if (boxOrGoal === 3) {
      setArrayPositionsBoxes(boxesOrGoals);
    } else {
      setArrayPositionsGoals(boxesOrGoals);
    }
  };

  const positionPlayer = (): [number, number] => {
    const playerRow = levelContainer.findIndex((row: number[]) => row.includes(7));
    const player = levelContainer[playerRow];
    const playerColumn = player ? player.indexOf(7) : -1;
    return [playerRow, playerColumn];
  };

  const nextPositionContentOfPlayer = (direction: ArrowKey = "ArrowUp") => {
    const [playerRow, playerColumn] = positionPlayer();
    switch (direction) {
      case "ArrowUp":
        return levelContainer[playerRow - 1][playerColumn];
      case "ArrowDown":
        return levelContainer[playerRow + 1][playerColumn];
      case "ArrowLeft":
        return levelContainer[playerRow][playerColumn - 1];
      case "ArrowRight":
        return levelContainer[playerRow][playerColumn + 1];
    }
  };

  const movePlayer = (direction: ArrowKey = "ArrowUp") => {
    const newLevelContainer = [...levelContainer];
    const [playerRow, playerColumn] = positionPlayer();
    switch (direction) {
      case "ArrowUp":
        newLevelContainer[playerRow][playerColumn] = 0;
        newLevelContainer[playerRow - 1][playerColumn] = 7;
        break;
      case "ArrowDown":
        newLevelContainer[playerRow][playerColumn] = 0;
        newLevelContainer[playerRow + 1][playerColumn] = 7;
        break;
      case "ArrowLeft":
        newLevelContainer[playerRow][playerColumn] = 0;
        newLevelContainer[playerRow][playerColumn - 1] = 7;
        break;
      case "ArrowRight":
        newLevelContainer[playerRow][playerColumn] = 0;
        newLevelContainer[playerRow][playerColumn + 1] = 7;
        break;
      default:
        break;
    }
    setLevelContainer(newLevelContainer);
  };

  const nextPositionContentOfBox = (direction: ArrowKey = "ArrowUp") => {
    const [playerRow, playerColumn] = positionPlayer();
    switch (direction) {
      case "ArrowUp":
        return levelContainer[playerRow - 2][playerColumn];
      case "ArrowDown":
        return levelContainer[playerRow + 2][playerColumn];
      case "ArrowLeft":
        return levelContainer[playerRow][playerColumn - 2];
      case "ArrowRight":
        return levelContainer[playerRow][playerColumn + 2];
    }
  };

  const moveBox = (direction: ArrowKey = "ArrowUp") => {
    const newLevelContainer = [...levelContainer];
    const [playerRow, playerColumn] = positionPlayer();
    switch (direction) {
      case "ArrowUp":
        newLevelContainer[playerRow - 1][playerColumn] = 3;
        break;
      case "ArrowDown":
        newLevelContainer[playerRow + 1][playerColumn] = 3;
        break;
      case "ArrowLeft":
        newLevelContainer[playerRow][playerColumn - 1] = 3;
        break;
      case "ArrowRight":
        newLevelContainer[playerRow][playerColumn + 1] = 3;
        break;
      default:
        break;
    }
    setLevelContainer(newLevelContainer);
  };

  // | 0 = empty | 1 = wall | 3 = box | 4 = goal | 7 = player |
  const handleKeyDown = ({ key }: { key: ArrowKey }): void => {
    // Set the direction of the player
    const keyPressed = {
      ArrowUp: "cell-player-ArrowUp",
      ArrowDown: "cell-player-ArrowDown",
      ArrowLeft: "cell-player-ArrowLeft",
      ArrowRight: "cell-player-ArrowRight",
    };
    setImgDirection(keyPressed[key]);
    // Check if the player can move to the next position and if the box can move to the next position
    if (nextPositionContentOfPlayer(key) === 0 || nextPositionContentOfPlayer(key) === 4) {
      movePlayer(key);
    } else if (nextPositionContentOfPlayer(key) === 3) {
      if (nextPositionContentOfBox(key) === 0 || nextPositionContentOfBox(key) === 4) {
        movePlayer(key);
        moveBox(key);
      }
    }
    // Update the arrayPositionsGoals
    const newArray = [...levelContainer];
    for (let i = 0; i < arrayPositionsGoals.length; i++) {
      if (levelContainer[arrayPositionsGoals[i][0]][arrayPositionsGoals[i][1]].valueOf() === 0) {
        // Complete this position with a goal
        newArray[arrayPositionsGoals[i][0]][arrayPositionsGoals[i][1]] = 4;
      }
    }
    // Update the arrayPositionsBoxes
    positionBoxesOrGoals(3);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const allowedKeys: ArrowKey[] = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

    if (allowedKeys.includes(event.key as ArrowKey)) {
      handleKeyDown({ key: event.key as ArrowKey });
    }
  };

  const selectLevel = ({ target: { value = "0" } }) => {
    setLevel(parseInt(value));
    setMessageWinner("");
  };

  const nextLevel = () => {
    setLevel(level + 1);
    setMessageWinner("");
  };

  const restartLevel = () => {
    setMessageWinner("");
    setLevelContainer(levelsCopy[level]);
    gameScreenRef.current?.focus();
  };

  const restartGame = () => {
    setLevel(0);
    setMessageWinner("");
    setLevelContainer(levelsCopy[0]);
  };

  const handleShowHideArrowButtons = () => {
    setShowArrowButtons(!showArrowButtons);
    gameScreenRef.current?.focus();
  };

  return (
    <>
      {messageWinner && (
        <div className="message-winner">
          <div>
            <h3>{messageWinner}</h3>
            {level < levelsCopy.length - 1 ? (
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

      {showRules && <Rules setShowRules={setShowRules} gameScreenRef={gameScreenRef} />}

      <h1 className="title">Sokoban</h1>
      <div className="pb-2 between flex">
        <select className="btn" value={level} onChange={selectLevel}>
          {levelsCopy.map((l = "", index = 0) => (
            <option key={index} value={index}>
              Level {index + 1}
            </option>
          ))}
        </select>
        <button className="btn" onClick={() => setShowRules(!showRules)}>
          How to play
        </button>
        <button className="btn" onClick={restartLevel}>
          Restart Level
        </button>
      </div>

      <div className="game" ref={gameScreenRef} tabIndex={-1} onKeyDown={onKeyDown}>
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
            <button className={`btn-arrow`} onClick={() => handleKeyDown({ key: "ArrowUp" })}>
              <svg className="svg-arrow" id="_1-Arrow_Up" data-name="1-Arrow Up" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <title>1-Arrow Up</title>
                <path d="M26.71,10.29l-10-10a1,1,0,0,0-1.41,0l-10,10,1.41,1.41L15,3.41V32h2V3.41l8.29,8.29Z" />
              </svg>
            </button>
          </div>
          <div className="arrows">
            <button className={`btn-arrow`} onClick={() => handleKeyDown({ key: "ArrowLeft" })}>
              <svg className="svg-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <title>4-Arrow Left</title>
                <g id="_4-Arrow_Left" data-name="4-Arrow Left">
                  <path d="M32,15H3.41l8.29-8.29L10.29,5.29l-10,10a1,1,0,0,0,0,1.41l10,10,1.41-1.41L3.41,17H32Z" />
                </g>
              </svg>
            </button>
            <button className={`btn-arrow`} onClick={() => handleKeyDown({ key: "ArrowDown" })}>
              <svg className="svg-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <title>2-Arrow Down</title>
                <g id="_2-Arrow_Down" data-name="2-Arrow Down">
                  <path d="M26.29,20.29,18,28.59V0H16V28.59L7.71,20.29,6.29,21.71l10,10a1,1,0,0,0,1.41,0l10-10Z" />
                </g>
              </svg>
            </button>
            <button className={`btn-arrow`} onClick={() => handleKeyDown({ key: "ArrowRight" })}>
              <svg className="svg-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <title>3-Arrow Right</title>
                <g id="_3-Arrow_Right" data-name="3-Arrow Right">
                  <path d="M31.71,15.29l-10-10L20.29,6.71,28.59,15H0v2H28.59l-8.29,8.29,1.41,1.41,10-10A1,1,0,0,0,31.71,15.29Z" />
                </g>
              </svg>
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
          <button className="btn mt-2" onClick={handleShowHideArrowButtons}>
            Show Arrows To Move
          </button>
        </div>
      )}
    </>
  );
};
