/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { StyledCell } from "./Cell.styles";
import { TETROMINOS } from "@/setup";

type Props = {
  type: keyof typeof TETROMINOS;
};

const Cell: React.FC<Props> = ({ type }: Props) => (
  <StyledCell type={type} color={TETROMINOS[type].color} />
);

export default React.memo(Cell);
