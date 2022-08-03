import { Box } from "./Box";
import { Guard } from "./Guard";
import { Inmate } from "./Inmate";

export type UIEvent = {
  currentInmate?: Inmate;
  currentBox?: Box;
  openBoxes: Box[];
  closedBoxes: Box[];
  guard: Guard;
};

export interface UIAdapter {
  emit(event: UIEvent): Promise<unknown>;
}
