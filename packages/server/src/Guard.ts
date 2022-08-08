import { Sheet } from "./Sheet";
import { Room } from "./Room";
import { Inmate } from "./Inmate";

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

  public async superviseBoxOpening(
    room: Room,
    inmate: Inmate
  ): Promise<boolean> {
    room.join(inmate);

    const allowedBoxes = room.boxCount / 2;

    let success = false;

    while (!success && room.openBoxes.length < allowedBoxes) {
      success = await inmate.openBox(room);
    }

    await room.reset();

    return success;
  }
}
