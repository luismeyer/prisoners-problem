import { atom } from "jotai";

import { configAtom } from "./config";

export type Box = {
  number: number;
  sheetNumber: number;
};

export type Inmate = {
  number: number;
  currentBox?: number;
};

export type Location = { left: number; top: number };

export type SimulationState = "setup" | "inProgress" | "done";

export const simulationStateAtom = atom<SimulationState>("setup");

export const inmatesAtom = atom<Inmate[]>((get) => {
  const array = Array.from({ length: get(configAtom).inmateCount });

  return array.map((_, index) => ({ number: index + 1 }));
});

export const allBoxesAtom = atom((get) => {
  const sheets: number[] = get(inmatesAtom).map((_, index) => index + 1);

  const shuffledSheets = shuffleSheets(sheets);

  return shuffledSheets.map((sheetNumber, index) => ({
    number: index + 1,
    sheetNumber,
  }));
});

export const openBoxesAtom = atom<Box[]>([]);

export const closedBoxesAtom = atom<Box[]>((get) =>
  get(allBoxesAtom).filter(
    (box) =>
      !get(openBoxesAtom).some((openBox) => openBox.number === box.number)
  )
);

export const boxLocationsAtom = atom<Record<number, Location>>({});

export const currentInmateAtom = atom<Inmate | undefined>(undefined);

const shuffleSheets = (sheets: number[]) => {
  const shuffled = sheets;

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};
