import { UIAdapter, UIEvent } from "./UIAdapter";

export class ConsoleAdapter implements UIAdapter {
  emit(event: UIEvent) {
    console.log(event);

    return Promise.resolve();
  }
}
