import { ConsoleAdapter } from "./Console";
import { Loop, Random, Strategy } from "./Strategy";
import { UIAdapter } from "./UIAdapter";

export class Config {
  public PROBLEM_COUNT = 100;

  public SIMULATION_COUNT = 100;

  public STRATEGY: Strategy = new Loop();

  public UI_ADAPTER: UIAdapter = new ConsoleAdapter();

  constructor() {
    this.loadCount();
    this.loadSimulationCount();
    this.loadStrategy();
  }

  private loadValueFromEnv(flag: string, type: "number" | "string") {
    const value = process.env[flag];

    if (!value) {
      return;
    }

    if (type === "string") {
      return value;
    }

    if (type === "number") {
      const numberValue = parseInt(value);

      return isNaN(numberValue) ? undefined : numberValue;
    }

    return value;
  }

  private loadCount() {
    const count = this.loadValueFromEnv("COUNT", "number");

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
    const simulationCount = this.loadValueFromEnv("SIM_COUNT", "number");

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
    const strategyName = this.loadValueFromEnv("STRATEGY", "string");

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
