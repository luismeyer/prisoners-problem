import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo, useRef } from "react";

import {
  allBoxesAtom,
  Box,
  currentInmateAtom,
  inmatesAtom,
  openBoxesAtom,
  simulationStateAtom,
} from "../store/simulation";
import { useRandomStrategy } from "./use-random-strategy";

export type Strategy = {
  findBox: (prevBox?: Box) => Box | undefined;
};

export const useSimulation = () => {
  const inmates = useAtomValue(inmatesAtom);

  const [currentInmate, setCurrentInmate] = useAtom(currentInmateAtom);

  const setSimulationState = useSetAtom(simulationStateAtom);

  const allBoxes = useAtomValue(allBoxesAtom);
  const [openBoxes, setOpenBoxes] = useAtom(openBoxesAtom);
  const allowedBoxes = useMemo(() => allBoxes.length / 2, [allBoxes]);

  const prevBox = useRef<Box | undefined>();

  const randomStrategy = useRandomStrategy();
  const strategy = useRef<Strategy>(randomStrategy);

  const start = useCallback(
    (strat: Strategy) => {
      setSimulationState("inProgress");

      strategy.current = strat;
    },
    [inmates]
  );

  const step = useCallback(() => {
    if (!currentInmate) {
      return;
    }

    const foundBox = prevBox.current?.sheetNumber === currentInmate?.number;
    const limitReached = openBoxes.length === allowedBoxes;

    if (foundBox || limitReached) {
      setOpenBoxes([]);

      const currentInmateNumber = currentInmate?.number ?? 0;
      const nextInmate = inmates.find(
        (inmate) => inmate.number === currentInmateNumber + 1
      );

      setCurrentInmate(nextInmate);
    }

    const box = strategy.current.findBox(prevBox.current);

    if (!box) {
      return;
    }

    setCurrentInmate({ ...currentInmate, currentBox: box.number });
    setOpenBoxes([...openBoxes, box]);

    prevBox.current = box;
  }, [prevBox.current, currentInmate, inmates, strategy.current]);

  return { start, step };
};
