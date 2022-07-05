import { Room } from "./Room.ts";
import { Box } from "./Box.ts";
import { Inmate } from "./Inmate.ts";

export interface Strategy {
  findBox(room: Room, inmate: Inmate, prevBox?: Box): Box;
}

export class Loop implements Strategy {
  findBox(room: Room, inmate: Inmate, prevBox?: Box) {
    const nextNumber = prevBox ? prevBox.sheet?.number : inmate.number;

    if (nextNumber === undefined) {
      throw new Error("Missing next number");
    }

    const next = room.closedBoxes.find((box) => box.number === nextNumber);

    if (!next) {
      throw new Error("Missing box " + nextNumber);
    }

    return next;
  }
}

export class Random implements Strategy {
  findBox(room: Room) {
    const boxNumber = Math.floor(Math.random() * room.closedBoxes.length);

    return room.closedBoxes[boxNumber];
  }
}
