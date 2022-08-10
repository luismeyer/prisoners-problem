import { useAtomValue } from "jotai";
import { FC, useCallback } from "react";

import { Config } from "./components/config";
import { Room } from "./components/room";
import { SimulationContext } from "./context/simulation";
import { useApi } from "./hooks/use-api";
import { configAtom } from "./store/config";

export const App: FC = () => {
  const config = useAtomValue(configAtom);

  const { start, loading, simulation, status, stop } = useApi();

  const startSimulation = useCallback(() => {
    if (loading) {
      return;
    }

    start();
  }, [start, loading]);

  return (
    <SimulationContext.Provider value={{ status, data: simulation }}>
      <Config />

      <div>
        <button disabled={status === "running"} onClick={startSimulation}>
          start
        </button>

        <button disabled={status !== "running"} onClick={stop}>
          stop
        </button>
      </div>

      <div>
        <span>Aktuelle Gefangene: {simulation.currentInmate?.number}</span>
      </div>

      <div>
        <span>Offene Boxen: {simulation.openBoxes.length}</span>
      </div>

      {config.ui && <Room />}
    </SimulationContext.Provider>
  );
};
