import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { Levels } from "../levels/Levels";
import { Rules } from "./Rules";

type ArrowKey = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

export const Game = () => {
  const [level, setLevel] = useState<number>(0);
  const [test, setTest] = useState<number>(77);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [levelContainer, setLevelContainer] = useState(JSON.parse(JSON.stringify(Levels[level])) as number[][]);
  const [arrayPositionsGoals, setArrayPositionsGoals] = useState<[number, number][]>([]);
  const [arrayPositionsBoxes, setArrayPositionsBoxes] = useState<[number, number][]>([]);

  const [imgDirection, setImgDirection] = useState("cell-player-ArrowUp");
  const [messageWinner, setMessageWinner] = useState("");

  const [showArrowButtons, setShowArrowButtons] = useState(false);
  const [pressedArrow, setPressedArrow] = useState(["", "", "", ""]);

  const gameScreenRef = useRef<HTMLDivElement>(null);

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
    gameScreenRef.current?.focus();
  }, [test]);

  const positionGoals = () => {
    let goals: [number, number][] = [];
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
    let boxes: [number, number][] = [];
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

  const positionPlayer = (): [number, number] => {
    const playerRow = levelContainer.findIndex((row: number[]) => row.includes(7));
    const player = levelContainer[playerRow];
    const playerColumn = player ? player.indexOf(7) : -1;
    return [playerRow, playerColumn];
  };

  const nextPositionContentOfPlayer = (direction: ArrowKey = "ArrowUp") => {
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

  const movePlayer = (direction: ArrowKey = "ArrowUp") => {
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

  const nextPositionContentOfBox = (direction: ArrowKey = "ArrowUp") => {
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

  const moveBox = (direction: ArrowKey = "ArrowUp") => {
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
  const handleKeyDown = ({ key }: { key: ArrowKey }): void => {
    // ----------------------------
    const keyPressed: { [key: string]: [string, string[]] } = {
      ArrowUp: ["cell-player-ArrowUp", ["pressing", "", "", ""]],
      ArrowDown: ["cell-player-ArrowDown", ["", "pressing", "", ""]],
      ArrowLeft: ["cell-player-ArrowLeft", ["", "", "pressing", ""]],
      ArrowRight: ["cell-player-ArrowRight", ["", "", "", "pressing"]],
    };

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
      setMessageWinner(`You won level ${level + 1}!`);
    }
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

      {showRules && <Rules setShowRules={setShowRules} />}

      <h1 className="title">Sokoban</h1>
      <div className="pb-2 between flex">
        <select className="btn" value={level} onChange={selectLevel}>
          {Levels.map((l, index) => (
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
            <button className={`btn-arrow ${pressedArrow[0]}`} onClick={() => handleKeyDown({ key: "ArrowUp" })}>
              <svg className="svg-arrow" id="_1-Arrow_Up" data-name="1-Arrow Up" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <title>1-Arrow Up</title>
                <path d="M26.71,10.29l-10-10a1,1,0,0,0-1.41,0l-10,10,1.41,1.41L15,3.41V32h2V3.41l8.29,8.29Z" />
              </svg>
            </button>
          </div>
          <div className="arrows">
            <button className={`btn-arrow ${pressedArrow[2]}`} onClick={() => handleKeyDown({ key: "ArrowLeft" })}>
              <svg className="svg-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <title>4-Arrow Left</title>
                <g id="_4-Arrow_Left" data-name="4-Arrow Left">
                  <path d="M32,15H3.41l8.29-8.29L10.29,5.29l-10,10a1,1,0,0,0,0,1.41l10,10,1.41-1.41L3.41,17H32Z" />
                </g>
              </svg>
            </button>
            <button className={`btn-arrow ${pressedArrow[1]}`} onClick={() => handleKeyDown({ key: "ArrowDown" })}>
              <svg className="svg-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <title>2-Arrow Down</title>
                <g id="_2-Arrow_Down" data-name="2-Arrow Down">
                  <path d="M26.29,20.29,18,28.59V0H16V28.59L7.71,20.29,6.29,21.71l10,10a1,1,0,0,0,1.41,0l10-10Z" />
                </g>
              </svg>
            </button>
            <button className={`btn-arrow ${pressedArrow[3]}`} onClick={() => handleKeyDown({ key: "ArrowRight" })}>
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
