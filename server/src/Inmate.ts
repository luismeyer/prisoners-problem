import { Room } from "./Room";
import { Box } from "./Box";
import { Strategy, Random } from "./Strategy";

export class Inmate {
  private readonly _number: number;

  private _strategy: Strategy = new Random();

  private prevBox: Box | undefined;

  constructor(number: number) {
    this._number = number;
  }

  public useStrategy(strategy: Strategy): void {
    this._strategy = strategy;
  }

  public get number(): number {
    return this._number;
  }

  public get strategy(): Strategy {
    return this._strategy;
  }

  public async openBox(room: Room): Promise<boolean> {
    const box = this._strategy.findBox(room, this, this.prevBox);

    const sheet = await room.openBox(box);

    if (!sheet) {
      throw new Error("Missing sheet in " + box.number);
    }

    if (sheet.number === this._number) {
      return true;
    }

    this.prevBox = box;

    return false;
  }

  toJSON() {
    return { number: this._number };
  }
}
