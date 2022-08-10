import { useAtomValue } from "jotai";
import { FC, useMemo, useRef } from "react";

import { useSimulation } from "../../context/simulation";
import { ChildRef, useRelativePositions } from "../../hooks/use-relativ-position";

import { configAtom } from "../../store/config";
import { Box } from "../box";
import { Inmate } from "../inmate";
import * as S from "./styled";

export const Room: FC = () => {
  const { data } = useSimulation();

  const gridRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<ChildRef[]>([]);

  const config = useAtomValue(configAtom);

  const relativePositions = useRelativePositions(gridRef, boxRefs);

  const boxSize = useMemo(() => {
    const maxSize = Math.min(window.innerWidth, window.innerHeight);

    return (maxSize - 100) / Math.sqrt(config.problemCount) / 2;
  }, [config.problemCount]);

  const allBoxes = useMemo(
    () => [...data.closedBoxes, ...data.openBoxes].sort((a, b) => a.number - b.number),
    [data.closedBoxes, data.openBoxes]
  );

  return (
    <S.Grid ref={gridRef} boxCount={config.problemCount} boxSize={boxSize}>
      {data.currentInmate && <Inmate boxLocations={relativePositions} />}

      {allBoxes.map((box) => (
        <Box
          ref={(ref) => {
            if (!ref) {
              return;
            }

            boxRefs.current = [...boxRefs.current, { number: box.number, ref }];
          }}
          sheetNumber={box.sheet?.number ?? 0}
          number={box.number}
          key={box.number}
          size={boxSize}
        />
      ))}
    </S.Grid>
  );
};
