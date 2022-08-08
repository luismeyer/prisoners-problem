import { atom } from "jotai";

export type Config = {
  problemCount: number;
  strategy: "loop" | "random";
  simulationCount: number;
  simulationSpeed: number;
  ui: boolean;
};

export const configAtom = atom<Config>({
  problemCount: 100,
  simulationCount: 10,
  strategy: "random",
  simulationSpeed: 1000,
  ui: true,
});
