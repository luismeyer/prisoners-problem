import { useAtomValue } from "jotai";
import { FC } from "react";

import PrisonerImg from "../../icons/prisoner.png";
import { boxLocationsAtom, currentInmateAtom } from "../../store/simulation";
import * as S from "./styled";

export const Inmate: FC = () => {
  const currentInmate = useAtomValue(currentInmateAtom);
  const boxLocations = useAtomValue(boxLocationsAtom);

  let left = "0";
  let top = "0";

  if (currentInmate?.currentBox && boxLocations) {
    const { currentBox } = currentInmate;

    const boxLocation = boxLocations[currentBox];

    if (boxLocation) {
      left = boxLocation.left + "px";
      top = boxLocation.top + "px";
    }
  }

  return (
    <S.AbsoluteContainer left={left} top={top}>
      <S.Img src={PrisonerImg} />
    </S.AbsoluteContainer>
  );
};
