import { UIAdapter, UIEvent } from "./UIAdapter";

export class ConsoleAdapter extends UIAdapter {
  emitHandler(event: UIEvent): Promise<unknown> {
    console.log(event);

    return Promise.resolve();
  }
}
