import React, { useState } from "react";
import { createStage, isColliding } from "./gameHelpers";

// Styles
import { StyledTetrisWrapper, StyledTetris } from "./App.styles";

//Components
import Display from "@/components/Display";
import Stage from "@/components/Stage";
import StartButton from "@/components/StartButton";

//Custom hooks
import { useInterval } from "@/hooks/useInterval";
import { usePlayer } from "@/hooks/usePlayer";
import { useStage } from "@/hooks/useStage";
import { useGameStatus } from "@/hooks/useGameStatus";

const App: React.FC = () => {
  const [droptTime, setDroptTime] = useState<null | number>(null);
  const [gameOver, setGameOver] = useState<boolean>(true);

  //REF
  const gameArea = React.useRef<HTMLDivElement>(null);

  //DESTRUCTURE
  const { player, updatePlayerPos, resetPlayer, playerRotate } = usePlayer();
  const { stage, setStage, rowsCleared } = useStage(player, resetPlayer);
  const { score, setScore, rows, setRows, level, setLevel } =
    useGameStatus(rowsCleared);

  const movePlayer = (dir: number) => {
    if (!isColliding(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  //* KEY UP FUNCTION
  const keyUp = ({ keyCode }: { keyCode: number }): void => {
    //* IF NOT GAMEOVER DON'T RUN BELOW CODE
    if (!gameOver) {
      //* CHANGE THE DROPTIME SPEED WHEN USER RELEASES DOWN ARROW
      if (keyCode === 40) {
        setDroptTime(1000 / level + 200);
      }
    }
  };

  // * START GAME FUNCTION
  const handleStartGame = (): void => {
    //* NEED TO FOCUS THE WINDOW WITH THE KEY EVENTS ON START
    if (gameArea.current) gameArea.current.focus();

    // * RESET EVERYTHING
    setStage(createStage());
    setDroptTime(1000);
    resetPlayer();
    setScore(0);
    setLevel(1);
    setRows(0);
    setGameOver(false);
  };

  // * MOVE FUNCTION
  const move = ({
    keyCode,
    repeat,
  }: {
    keyCode: number;
    repeat: boolean;
  }): void => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        //JUST CALL ONCE
        if (repeat) return;
        setDroptTime(30);
      } else if (keyCode === 38) {
        playerRotate(stage);
      }
    }
  };

  // * DROP FUNCTION
  const drop = (): void => {
    //INCREASE LEVEL WHEN PLAYER CLEAR TEN ROWS
    if (rows > level * 10) {
      setLevel((prev) => prev + 1);

      // * INCREASE SPEED
      setDroptTime(1000 / level + 200);
    }

    if (!isColliding(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      //GAME OVER
      if (player.pos.y < 1) {
        console.log("GAME OVER");
        setGameOver(true);
        setDroptTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  useInterval(() => {
    drop();
  }, droptTime);

  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex={0}
      onKeyDown={move}
      onKeyUp={keyUp}
      ref={gameArea}>
      <StyledTetris>
        <div className="display">
          {gameOver ? (
            <>
              <Display gameOver={gameOver} text="Game Over!" />
              <StartButton callback={handleStartGame} />
            </>
          ) : (
            <>
              <Display text={`Score:${score} `} />
              <Display text={`Rows: ${rows} `} />
              <Display text={`Level: ${level}`} />
            </>
          )}
        </div>
        <Stage stage={stage} />
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default App;
