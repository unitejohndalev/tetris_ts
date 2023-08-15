import { PLAYER } from "@/hooks/usePlayer";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./setup";
import { TETROMINOS } from "./setup";

export type STAGECELL = [keyof typeof TETROMINOS, string];
export type STAGE = STAGECELL[][]; 


export const createStage = () =>
  Array.from(Array(STAGE_HEIGHT), () => Array(STAGE_WIDTH).fill([0, "clear"]));

export const randomTetromino = () => {
  const tetrominos = [
    "I",
    "J",
    "L",
    "O",
    "S",
    "T",
    "Z",
  ] as (keyof typeof TETROMINOS)[];
  const randTetromino =
    tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};

export const isColliding = (
  player: PLAYER,
  stage: STAGE,
  { x: moveX, y: moveY }: { x: number; y: number }
) => {
  //* USING FOR LOOPS TO BE ABLE TO RETURN AND  BREAK. NOT POSSIBLE WITH FOREACH
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      // * 1. CHECK THAT WE'RE ON AN ACTUAL TETROMINO CELL
      if (player.tetromino[y][x] !== 0) {
        if (
          //* 2. CHECK THAT OUR MOVE IS INSIDE THE GAME AREAS HEIGHT (Y) THAT WE'RE NOT MOVING THROUGH BOTTOM OF THE GRID
          !stage[y + player.pos.y + moveY] ||
          //* 3. CHECK THAT OUR MOVE IS INSIDE THE GAME AREAS WIDTH (X)
          !stage[y + player.pos.y + moveX][x + player.pos.x + moveX] ||
          // * 4. CHECK THAT THE CELL WE'RE MOVING TO ISN'T SET TO CLEAR
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !==
            "clear"
        ) {
          return true;
        }
      }
    }
  }

  //* 5. IF EVERYTHING ABOVE IS FALSE
  return false;
};
