import { useAtomValue } from "jotai";
import { FC, useMemo } from "react";

import { useSimulation } from "../../context/simulation";
import { Locations } from "../../hooks/use-relativ-position";
import PrisonerImg from "../../icons/prisoner.png";
import { configAtom } from "../../store/config";
import * as S from "./styled";

type InmateProps = {
  boxLocations: Locations;
};

export const Inmate: FC<InmateProps> = ({ boxLocations }) => {
  const { data } = useSimulation();

  const { simulationSpeed } = useAtomValue(configAtom);

  const location = useMemo(() => {
    let left = "0";
    let top = "0";

    if (data.currentBox && boxLocations) {
      const boxLocation = boxLocations[data.currentBox.number];

      if (boxLocation) {
        left = boxLocation.left + "px";
        top = boxLocation.top + "px";
      }
    }

    return { left, top };
  }, [data.currentBox, boxLocations]);

  return (
    <S.AbsoluteContainer
      speed={simulationSpeed / 1000}
      left={location.left}
      top={location.top}
    >
      <S.Img src={PrisonerImg} />
    </S.AbsoluteContainer>
  );
};
