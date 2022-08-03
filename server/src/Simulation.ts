import { Config } from "./Config";
import { Prison } from "./Prison";

type RunResult = {
  fails: number;
  failRate: number;
};

export class Simulation {
  private _config: Config;

  constructor(config: Config) {
    this._config = config;
  }

  private async run() {
    const { PROBLEM_COUNT, STRATEGY } = this._config;

    // create prison with inmates
    const prison = new Prison(this._config);
    prison.generateInmates(PROBLEM_COUNT);

    const { guard, inmates, room } = prison;

    // create sheets, shuffle and distribute them into boxes
    const sheets = guard.createNumberSheets(PROBLEM_COUNT);
    guard.shuffleSheets(sheets);
    guard.distributeSheets(sheets, room);

    // set the strategy
    inmates.forEach((inmate) => {
      inmate.useStrategy(STRATEGY);
    });

    let result: boolean[] = [];

    // execute the strategy for each inmate
    for (let inmate of inmates) {
      result = [...result, await guard.superviseBoxOpening(room, inmate)];
    }

    // calculate the amount of fails and successes
    const fails = result.reduce((acc, success) => (success ? acc : acc + 1), 0);

    return fails;
  }

  public async execute() {
    const { PROBLEM_COUNT, SIMULATION_COUNT } = this._config;

    let runNumber = 0;

    let overallFailRate = 0;

    let failedRuns = 0;

    let failedInmates = 0;

    let runData: Record<number, RunResult> = {};

    while (runNumber < SIMULATION_COUNT) {
      runNumber = runNumber + 1;

      const fails = await this.run();
      const failRate = fails / PROBLEM_COUNT;

      overallFailRate = overallFailRate + failRate;
      failedInmates = failedInmates + fails;

      runData = { ...runData, [runNumber]: { fails, failRate } };

      if (fails > 0) {
        failedRuns = failedRuns + 1;
      }
    }

    return {
      failedRuns,
      failRatePerRun: failedRuns / SIMULATION_COUNT,
      failedInmates,
      failRatePerInmate: overallFailRate / SIMULATION_COUNT,
      runData,
    };
  }
}