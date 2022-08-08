import { Box } from "./Box";
import { Config } from "./Config";
import { Guard } from "./Guard";
import { Inmate } from "./Inmate";

export type UIEvent = {
  currentInmate?: Inmate;
  currentBox?: Box;
  openBoxes: Box[];
  closedBoxes: Box[];
  guard: Guard;
};

export abstract class UIAdapter {
  protected _config: Config;

  constructor(config: Config) {
    this._config = config;
  }

  abstract emitHandler(event: UIEvent): Promise<unknown>;

  public async emit(event: UIEvent) {
    await new Promise((res) => setTimeout(res, this._config.SIMULATION_SPEED));

    await this.emitHandler(event);
  }
}
