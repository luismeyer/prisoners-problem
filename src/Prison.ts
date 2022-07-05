import { Inmate } from "./Inmate.ts";
import { Room } from "./Room.ts";

export class Prison {
  private _inmates: Inmate[] = [];

  private _room: Room;

  constructor(count: number) {
    this._room = new Room(count);

    this._inmates = Array(count)
      .fill(0)
      .map((_, index) => new Inmate(index));
  }

  public get room() {
    return this._room;
  }

  public get inmates() {
    return this._inmates;
  }
}
