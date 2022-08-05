import { atom } from "jotai";

export type Config = {
  inmateCount: number;
  simulationCount: number;
  strategy: "random" | "loop";
  ui: boolean;
};

const configDefaultAtom = atom<Config>({
  inmateCount: 100,
  simulationCount: 1,
  strategy: "random",
  ui: true,
});

export const configAtom = atom<Config, Partial<Config>>(
  (get) => get(configDefaultAtom),
  (get, set, update) => {
    const oldValue = get(configDefaultAtom);

    set(configDefaultAtom, { ...oldValue, ...update });
  }
);
