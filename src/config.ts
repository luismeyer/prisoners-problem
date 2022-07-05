import { Strategy, Random, Loop } from "./Strategy.ts";

export class Config {
  public PROBLEM_COUNT = 100;

  public SIMULATION_COUNT = 1000;

  public STRATEGY: Strategy = new Random();

  constructor() {
    this.loadCount();

    this.loadSimulationCount();

    this.loadStrategy();
  }

  private loadValueFromArg(flag: string) {
    const strategyArgIndex = Deno.args.findIndex((arg) => arg === flag);

    if (strategyArgIndex + 1 > Deno.args.length) {
      return;
    }

    return Deno.args[strategyArgIndex + 1];
  }

  private loadCount() {
    const count = this.loadValueFromArg("-c");

    if (!count) {
      return;
    }

    const parsedCount = Number(count);

    if (isNaN(parsedCount)) {
      throw new Error("Count config needs to be an integer");
    }

    this.PROBLEM_COUNT = parsedCount;
  }

  private loadSimulationCount() {
    const simulationCount = this.loadValueFromArg("-sc");

    if (!simulationCount) {
      return;
    }

    const parsedSimulationCount = Number(simulationCount);

    if (isNaN(parsedSimulationCount)) {
      throw new Error("Simulation Count config needs to be an integer");
    }

    this.SIMULATION_COUNT = parsedSimulationCount;
  }

  private loadStrategy() {
    const strategyName = this.loadValueFromArg("-s");

    if (!strategyName) {
      return;
    }

    switch (strategyName) {
      case "loop":
        this.STRATEGY = new Loop();
        break;
      case "random":
        this.STRATEGY = new Random();
        break;
      default:
        throw new Error("Unknown strategy name: " + strategyName);
    }
  }
}
