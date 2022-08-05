import { Sheet, SimpleSheet } from "./Sheet";

export type SimpleBox = {
  sheet: SimpleSheet | undefined;
  number: number;
};

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

  public simplify(): SimpleBox {
    return {
      sheet: this._sheet?.simplify(),
      number: this.number,
    };
  }
}
