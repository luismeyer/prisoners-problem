import { Box } from "./Box";
import { Config } from "./Config";
import { Guard } from "./Guard";
import { Inmate } from "./Inmate";

export type UISimulationUpdate = {
  type: "sim";
  currentInmate?: Inmate;
  currentBox?: Box;
  openBoxes: Box[];
  closedBoxes: Box[];
  guard: Guard;
};

export type UIStatsUpdate = {
  type: "stats";
  runNumber: number;
  fails: number;
  failRate: number;
};

export type UIUpdate = UISimulationUpdate | UIStatsUpdate;

export abstract class UIAdapter {
  protected _config: Config;

  constructor(config: Config) {
    this._config = config;
  }

  abstract emitHandler(event: UIUpdate): Promise<unknown>;

  public async emit(event: UIUpdate) {
    await new Promise((res) => setTimeout(res, this._config.SIMULATION_SPEED));

    await this.emitHandler(event);
  }
}
