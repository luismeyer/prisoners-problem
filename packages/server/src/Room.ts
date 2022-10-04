import { Box } from "./Box";
import { Config } from "./Config";
import { Guard } from "./Guard";
import { Inmate } from "./Inmate";
import { Sheet } from "./Sheet";

export class Room {
  public boxCount = 0;

  private _openBoxes: Box[] = [];
  private _allBoxes: Box[] = [];

  private _config: Config;

  private _guard: Guard;
  private _inmate?: Inmate;

  constructor(guard: Guard, config: Config) {
    this._config = config;

    this._guard = guard;
  }

  public async setupBoxes(boxCount: number): Promise<void> {
    this.boxCount = boxCount;

    this._allBoxes = Array(boxCount)
      .fill(0)
      .map((_, index) => new Box(index));

    await this.reset();
  }

  public async join(inmate: Inmate): Promise<void> {
    this._inmate = inmate;

    await this.updateUI();
  }

  public get closedBoxes(): Box[] {
    return this._allBoxes.filter((box1) => !this._openBoxes.some((box2) => box1.number === box2.number));
  }

  public get openBoxes(): Box[] {
    return this._openBoxes;
  }

  public async reset(): Promise<void> {
    this._openBoxes = [];
    this._inmate = undefined;

    await this.updateUI();
  }

  public async openBox(box: Box): Promise<Sheet | undefined> {
    if (!this._inmate) {
      throw new Error("Cannot open box because no inmate is in the room");
    }

    this._openBoxes.push(box);

    await this.updateUI(box);

    return box.sheet;
  }

  private async updateUI(currentBox?: Box) {
    await this._config.UI_ADAPTER.emit({
      currentBox,
      closedBoxes: this.closedBoxes,
      openBoxes: this.openBoxes,
      currentInmate: this._inmate,
      guard: this._guard,
    });
  }
}
