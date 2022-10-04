import { Config } from "./Config";
import { Guard } from "./Guard";
import { Inmate } from "./Inmate";
import { Room } from "./Room";

export class Prison {
  private _inmates: Inmate[] = [];

  private _room: Room;

  private _guard: Guard;

  constructor(config: Config) {
    this._guard = new Guard();
    this._room = new Room(this._guard, config);
  }

  public async generateInmates(count: number) {
    await this._room.setupBoxes(count);

    this._inmates = Array(count)
      .fill(0)
      .map((_, index) => new Inmate(index));
  }

  public get guard() {
    return this._guard;
  }

  public get room() {
    return this._room;
  }

  public get inmates() {
    return this._inmates;
  }
}
