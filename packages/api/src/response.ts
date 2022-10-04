import { ApiSimulation } from ".";

export type ConnectedResponse = {
  type: "connected";
  data: "success";
};

export type UpdateResponse = {
  type: "update";
  message: number;
  data: ApiSimulation;
};

export type RunResponse = {
  fails: number;
  failRate: number;
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
        runData: Record<number, RunResponse>;
      };
};

export type RunningResponse = {
  type: "running";
  data: "success";
};

export type ApiResponse = UpdateResponse | ResultMessage | ConnectedResponse | RunningResponse;
