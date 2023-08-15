import { createStage } from "@/gameHelpers";
import { useState, useEffect } from "react";

//* TYPES
import type { PLAYER } from "./usePlayer";

export type STAGECELL = [string | number, string];
export type STAGE = STAGECELL[][];

export const useStage = (player: PLAYER, resetPlayer: () => void) => {
  const [stage, setStage] = useState(createStage());

  const [rowsCleared, setRowsCleared] = useState(0)

  useEffect(() => {
    if (!player.pos) return;
    setRowsCleared(0)


    const sweepRows = (newStage: STAGE) : STAGE => {
      return newStage.reduce((ack, row) => {
        // * IF WE DON'T FIND A 0 IT MEANS THAT THE ROW IS FULL AND SHOULD BE CLEARED
        if(row.findIndex(cell => cell[0] === 0) === -1) {
          setRowsCleared(prev => prev + 1)
          // * CREATE AN EMPTY ROW AT THE BEGINNING OF THE ARRAY TO PUSH THE TETROMINO DOWN INSTEAD OF RETURNING THE CLEARED ROW
          ack.unshift(new Array(newStage[0].length).fill([0, 'clear']) as STAGECELL[])
          return ack;
      
        }
        ack.push(row);
        return ack;
        }, [] as STAGE)
    }


    const updateStage = (prevStage: STAGE): STAGE => {
      //FIRST FLUSH THE STAGE | CLEAR THE STAGE
      //* IF IS SAYS "CLEAR" BUT DON'T HAVE A 0 IT MEANS THAT IT'S THE PLAYERS MOVE AND SHOULD BE CLEARED
      const newStage = prevStage.map(
        (row) =>
          row.map((cell) =>
            cell[1] === "clear" ? [0, "clear"] : cell
          ) as STAGECELL[]
      );

      //THEN DRAW THE TETROMINO
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? "merged" : "clear"}`,
            ];
          }
        });
      });

      if(player.collided) {
        resetPlayer();
        return sweepRows(newStage)
      }

      return newStage;
    };

    setStage((prev) => updateStage(prev));
  }, [player.collided, player.pos?.x, player.pos?.y, player.tetromino]);

  return { stage, setStage, rowsCleared };
};
