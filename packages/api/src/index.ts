export * from "./request";
export * from "./response";

export type ApiSheet = {
  number: number | undefined;
};

export type ApiBox = {
  sheet: ApiSheet | undefined;
  number: number;
};

export type ApiInmate = {
  number: number;
};

export type ApiSimulation = {
  currentInmate: ApiInmate | undefined;
  currentBox: ApiBox | undefined;
  openBoxes: ApiBox[];
  closedBoxes: ApiBox[];
};
