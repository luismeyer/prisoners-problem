import http from "http";
import ws from "ws";

import { Config } from "./Config";
import { Simulation } from "./Simulation";
import { Loop, Random } from "./Strategy";
import { UIAdapter, UIEvent } from "./UIAdapter";

type StartMessage = {
  problemCount?: unknown;
  strategy?: unknown;
  simulationCount?: unknown;
  simulationSpeed?: unknown;
};

export class WebSocketServer {
  private server: http.Server;

  constructor(server: http.Server) {
    this.server = server;
  }

  private parseConfig(message: string) {
    try {
      const payload: StartMessage = JSON.parse(message);

      const config = new Config();
      const { problemCount, simulationCount, strategy } = payload;

      if (problemCount && typeof problemCount === "number") {
        config.PROBLEM_COUNT = problemCount;
      }

      if (simulationCount && typeof simulationCount === "number") {
        config.SIMULATION_COUNT = simulationCount;
      }

      if (strategy && strategy === "loop") {
        config.STRATEGY = new Loop();
      }

      if (strategy && strategy === "random") {
        config.STRATEGY = new Random();
      }

      return config;
    } catch {
      return new Config();
    }
  }

  public start() {
    const wss = new ws.Server({ server: this.server });

    wss.on("connection", (ws) => {
      let isRunning = false;

      ws.on("message", async (message: string) => {
        if (isRunning) {
          ws.send("Sim already running");
          return;
        }

        const config = this.parseConfig(message);

        const adapter = new ServerAdapter(ws);
        config.UI_ADAPTER = adapter;

        const simulation = new Simulation(config);
        const result = await simulation.execute();

        const parsedResult = JSON.stringify(result);
        ws.send(parsedResult);
      });

      ws.send("CONNECTED");
    });
  }
}

export class ServerAdapter implements UIAdapter {
  public websocket: ws.WebSocket;

  constructor(websocket: ws.WebSocket) {
    this.websocket = websocket;
  }

  private stringifyEvent(event: UIEvent): string {
    const closedBoxes = event.closedBoxes.map((box) => box.toJSON());
    const openBoxes = event.openBoxes.map((box) => box.toJSON());
    const currentBox = event.currentBox?.toJSON();

    const currentInmate = event.currentInmate?.toJSON();

    return JSON.stringify({
      currentInmate,
      currentBox,
      openBoxes,
      closedBoxes,
    });
  }

  emit(event: UIEvent) {
    const json = this.stringifyEvent(event);

    return new Promise((res, rej) => {
      this.websocket.send(json, (err) => {
        if (err) {
          rej(err);
        }

        res("success");
      });
    });
  }
}
