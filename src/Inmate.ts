import { Room } from "./Room.ts";
import { Box } from "./Box.ts";
import { Strategy, Random } from "./Strategy.ts";

export class Inmate {
  private readonly _number: number;

  private _strategy: Strategy = new Random();

  private prevBox: Box | undefined;

  constructor(number: number) {
    this._number = number;
  }

  public useStrategy(strategy: Strategy) {
    this._strategy = strategy;
  }

  public get number() {
    return this._number;
  }

  public get strategy() {
    return this._strategy;
  }

  public openBox(room: Room) {
    const box = this._strategy.findBox(room, this, this.prevBox);

    const sheet = room.openBox(box);

    if (!sheet) {
      throw new Error("Missing sheet in " + box.number);
    }

    if (sheet.number === this._number) {
      return true;
    }

    this.prevBox = box;

    return false;
  }
}
