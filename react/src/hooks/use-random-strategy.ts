import { useAtomValue } from "jotai";
import { closedBoxesAtom } from "../store/simulation";
import { Strategy } from "./use-simulation";

export const useRandomStrategy = (): Strategy => {
  const closedBoxes = useAtomValue(closedBoxesAtom);

  return {
    findBox: () => {
      if (closedBoxes.length === 0) {
        return;
      }

      return closedBoxes[Math.floor(Math.random() * closedBoxes.length)];
    },
  };
};
