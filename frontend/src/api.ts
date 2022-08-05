export type SimpleSheet = {
  number: number | undefined;
};

export type SimpleBox = {
  sheet: SimpleSheet | undefined;
  number: number;
};

export type SimpleInmate = {
  number: number;
};

export type ApiEvent = {
  currentInmate: SimpleInmate | undefined;
  currentBox: SimpleBox | undefined;
  openBoxes: SimpleBox[];
  closedBoxes: SimpleBox[];
};

export type RunResult = {
  fails: number;
  failRate: number;
};

export type SimulationResult =
  | "CANCELLED"
  | {
      failedRuns: number;
      failRatePerRun: number;
      failedInmates: number;
      failRatePerInmate: number;
      runData: Record<number, RunResult>;
    };

export type ApiMessage = UpdateMessage | ResultMessage;

export type UpdateMessage = {
  type: "update";
  data: ApiEvent;
};

export type ResultMessage = {
  type: "done";
  data: SimulationResult;
};
