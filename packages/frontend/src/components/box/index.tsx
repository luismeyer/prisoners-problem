import React from "react";

import OpenIcon from "../../icons/open.png";
import CloseIcon from "../../icons/closed.png";

import * as S from "./styled";
import { useSimulation } from "../../context/simulation";

type BoxProps = {
  number: number;
  sheetNumber: number;

  size: number;
};

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(({ sheetNumber, size, number }, ref) => {
  const { data } = useSimulation();

  const open = data.openBoxes.some((box) => number === box.number);

  return (
    <S.Container ref={ref} size={size}>
      <S.Img size={size} src={open ? OpenIcon : CloseIcon} />
      {open && <S.Sheet size={size}>{sheetNumber}</S.Sheet>}

      <S.Number>{number}</S.Number>
    </S.Container>
  );
});
