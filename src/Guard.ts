import { Sheet } from "./Sheet.ts";
import { Room } from "./Room.ts";
import { Inmate } from "./Inmate.ts";

export class Guard {
  public createNumberSheets(sheetCount: number): Sheet[] {
    const countArray = Array(sheetCount).fill(0);

    return countArray.map((_, index) => {
      const sheet = new Sheet();
      sheet.writeNumber(index);

      return sheet;
    });
  }

  public shuffleSheets(sheets: Sheet[]): void {
    for (let i = sheets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [sheets[i], sheets[j]] = [sheets[j], sheets[i]];
    }
  }

  public distributeSheets(sheets: Sheet[], room: Room): void {
    room.closedBoxes.forEach((box, index) => {
      const sheet = sheets[index];

      box.insertSheet(sheet);
    });
  }

  public superviseBoxOpening(room: Room, inmate: Inmate): boolean {
    const allowedBoxes = room.boxCount / 2;

    let success = false;

    let sameNumberCount = 0;

    let oldNumber = 0;

    while (!success && room.openBoxes.length <= allowedBoxes) {
      success = inmate.openBox(room);

      if (oldNumber === room.openBoxes.length) {
        sameNumberCount = sameNumberCount + 1;
      }

      if (sameNumberCount === 10) {
        throw new Error("LOl");
      }

      oldNumber = room.openBoxes.length;
    }

    room.reset();

    return success;
  }
}
