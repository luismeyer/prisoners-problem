export type SimpleSheet = {
  number: number | undefined;
};

export class Sheet {
  private _number: number | undefined;

  public writeNumber(number: number): void {
    this._number = number;
  }

  public get number() {
    return this._number;
  }

  public simplify(): SimpleSheet {
    return { number: this._number };
  }
}
