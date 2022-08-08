import { ConsoleAdapter } from "./Console";
import { Loop, Random, Strategy } from "./Strategy";
import { UIAdapter } from "./UIAdapter";

export class Config {
  public PROBLEM_COUNT = 100;

  public SIMULATION_COUNT = 10;

  public SIMULATION_SPEED = 0;

  public STRATEGY: Strategy = new Loop();

  public UI_ADAPTER: UIAdapter;

  constructor() {
    this.loadCount();
    this.loadSimulationCount();
    this.loadStrategy();
    this.loadSimulationSpeed();

    this.UI_ADAPTER = new ConsoleAdapter(this);
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

    if (count) {
      this.PROBLEM_COUNT = Number(count);
    }
  }

  private loadSimulationSpeed() {
    const simulationSpeed = this.loadValueFromEnv("SIMULATION_SPEED", "number");

    if (simulationSpeed) {
      this.SIMULATION_SPEED = Number(simulationSpeed);
    }
  }

  private loadSimulationCount() {
    const simulationCount = this.loadValueFromEnv("SIMULATION_COUNT", "number");

    if (simulationCount) {
      this.SIMULATION_COUNT = Number(simulationCount);
    }
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
