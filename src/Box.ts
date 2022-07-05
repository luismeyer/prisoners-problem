import { Sheet } from "./Sheet.ts";

export class Box {
  private _sheet: Sheet | undefined;

  public readonly number: number;

  constructor(number: number) {
    this.number = number;
  }

  public insertSheet(sheet: Sheet): void {
    this._sheet = sheet;
  }

  public get sheet() {
    return this._sheet;
  }
}
