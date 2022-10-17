import { ApiSimulation } from ".";

export type ConnectedResponse = {
  type: "connected";
  data: "success";
};

export type StatsData = {
  fails: number;
  failRate: number;
};

export type StatsResponse = {
  type: "stats";
  data: StatsData;
};

export type UpdateResponse = {
  type: "update";
  data: ApiSimulation;
};

export type ResultMessage = {
  type: "done";
  data:
    | "CANCELLED"
    | {
        failedRuns: number;
        failRatePerRun: number;
        failedInmates: number;
        failRatePerInmate: number;
        runData: Record<number, StatsData>;
      };
};

export type RunningResponse = {
  type: "running";
  data: "success";
};

export type ApiResponse = UpdateResponse | ResultMessage | ConnectedResponse | RunningResponse | StatsResponse;
