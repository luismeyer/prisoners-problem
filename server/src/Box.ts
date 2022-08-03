import { Sheet } from "./Sheet";

export class Box {
  public _sheet: Sheet | undefined;

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

  public toJSON() {
    return {
      sheet: this._sheet?.toJSON(),
      number: this.number,
    };
  }
}
