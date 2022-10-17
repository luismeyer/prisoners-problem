import { UIAdapter, UISimulationUpdate } from "./UIAdapter";

export class ConsoleAdapter extends UIAdapter {
  emitHandler(event: UISimulationUpdate): Promise<unknown> {
    console.log(event);

    return Promise.resolve();
  }
}
