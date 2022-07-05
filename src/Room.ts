import { Box } from "./Box.ts";
import { Sheet } from "./Sheet.ts";

export class Room {
  public boxCount: number;
  private _openBoxes: Box[] = [];

  private readonly allBoxes: Box[] = [];

  constructor(boxCount: number) {
    this.boxCount = boxCount;

    this.allBoxes = Array(boxCount)
      .fill(0)
      .map((_, index) => new Box(index));

    this.reset();
  }

  public get closedBoxes() {
    return this.allBoxes.filter(
      (box1) => !this._openBoxes.some((box2) => box1.number === box2.number)
    );
  }

  public get openBoxes() {
    return this._openBoxes;
  }

  public checkOpenBoxes() {
    return this._openBoxes;
  }

  public reset() {
    this._openBoxes = [];
  }

  public openBox(box: Box): Sheet | undefined {
    this._openBoxes.push(box);

    return box.sheet;
  }
}
