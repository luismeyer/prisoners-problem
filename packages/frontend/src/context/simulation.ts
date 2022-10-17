import React, { useContext } from "react";

import { ApiSimulation } from "@prisoners-problem/api";

type SimulationContext = {
  status: "setup" | "running";
  data: ApiSimulation;
  // runResults: RunResponse[];
};

export const SimulationContext = React.createContext<SimulationContext>({
  status: "setup",
  data: {
    closedBoxes: [],
    openBoxes: [],
    currentBox: undefined,
    currentInmate: undefined,
  },
  // runResults: [],
});

export const useSimulation = () => {
  return useContext(SimulationContext);
};
