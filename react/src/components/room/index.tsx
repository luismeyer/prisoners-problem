import { useAtomValue, useSetAtom } from "jotai";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChildRef,
  useRelativeLocations,
} from "../../hooks/use-relative-position";
import { useResizeEffect } from "../../hooks/use-resize-effect";

import { configAtom } from "../../store/config";
import {
  allBoxesAtom,
  boxLocationsAtom,
  currentInmateAtom,
  openBoxesAtom,
} from "../../store/simulation";
import { Box } from "../box";
import { Inmate } from "../inmate";
import * as S from "./styled";

export const Room: FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<ChildRef[]>([]);

  const currentInmate = useAtomValue(currentInmateAtom);

  const allBoxes = useAtomValue(allBoxesAtom);
  const setBoxLocations = useSetAtom(boxLocationsAtom);

  const config = useAtomValue(configAtom);

  const relativePositions = useRelativeLocations(gridRef, boxRefs);

  const boxSize = useMemo(() => {
    const maxSize = Math.min(window.innerWidth, window.innerHeight);

    return (maxSize - 100) / Math.sqrt(config.inmateCount) / 2;
  }, [config.inmateCount]);

  const updateBoxLocations = useCallback(() => {
    setBoxLocations(relativePositions());
  }, [relativePositions]);

  useResizeEffect(updateBoxLocations);

  useEffect(() => updateBoxLocations, [config.inmateCount]);

  return (
    <S.Grid ref={gridRef} boxCount={config.inmateCount} boxSize={boxSize}>
      {currentInmate && <Inmate />}

      {allBoxes.map((box) => (
        <Box
          ref={(ref) => {
            if (!ref) {
              return;
            }

            boxRefs.current = [...boxRefs.current, { number: box.number, ref }];
          }}
          sheetNumber={box.sheetNumber}
          number={box.number}
          key={box.number}
          size={boxSize}
        />
      ))}
    </S.Grid>
  );
};
