export type StartRequest = {
  type: "start";
  problemCount?: unknown;
  strategy?: unknown;
  simulationCount?: unknown;
  simulationSpeed?: unknown;
};

export type StopRequest = {
  type: "stop";
};

export type ApiRequest = StartRequest | StopRequest;
