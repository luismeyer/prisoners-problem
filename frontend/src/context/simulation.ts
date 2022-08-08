import React, { useContext } from "react";
import { Simulation } from "../api";

type SimulationContext = {
  status: "setup" | "running";
  data: Simulation;
};

export const SimulationContext = React.createContext<SimulationContext>({
  status: "setup",
  data: {
    closedBoxes: [],
    openBoxes: [],
    currentBox: undefined,
    currentInmate: undefined,
  },
});

export const useSimulation = () => {
  return useContext(SimulationContext);
};
