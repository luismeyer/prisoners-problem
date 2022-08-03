import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { FC, useCallback } from "react";

import { Config } from "./components/config";
import { Room } from "./components/room";
import { useRandomStrategy } from "./hooks/use-random-strategy";
import { useSimulation } from "./hooks/use-simulation";
import { configAtom } from "./store/config";
import {
  boxLocationsAtom,
  closedBoxesAtom,
  currentInmateAtom,
  openBoxesAtom,
  simulationStateAtom,
} from "./store/simulation";

export const App: FC = () => {
  const config = useAtomValue(configAtom);

  const currentInmate = useAtomValue(currentInmateAtom);

  const randomStrategy = useRandomStrategy();

  const { start, step } = useSimulation();

  return (
    <>
      <Config />

      <div>
        <button onClick={() => start(randomStrategy)}>start</button>
        <span>{currentInmate?.number}</span>
      </div>

      {config.ui && <Room />}
    </>
  );
};
