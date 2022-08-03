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
  private _server: http.Server;

  private _simulations: WeakMap<ws.WebSocket, Simulation>;

  constructor(server: http.Server) {
    this._server = server;
    this._simulations = new WeakMap();
  }

  private parseConfig(message: string) {
    try {
      const payload: StartMessage = JSON.parse(message);

      const config = new Config();
      const { problemCount, simulationCount, strategy, simulationSpeed } =
        payload;

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

      if (simulationSpeed && typeof simulationSpeed === "number") {
        config.SIMULATION_SPEED = simulationSpeed;
      }

      return config;
    } catch {
      return new Config();
    }
  }

  public start() {
    const wss = new ws.Server({ server: this._server });

    wss.on("connection", (ws) => {
      ws.on("message", async (message) => {
        const simulation = this._simulations.get(ws);

        const payload = message.toString();

        if (simulation && payload === "STOP") {
          simulation.stop();
          this._simulations.delete(ws);
          return;
        }

        if (simulation) {
          ws.send("Sim already running");
          return;
        }

        const config = this.parseConfig(payload);

        const adapter = new ServerAdapter(config, ws);
        config.UI_ADAPTER = adapter;

        const newSimulation = new Simulation(config);
        this._simulations.set(ws, newSimulation);

        const result = await newSimulation.start();

        const parsedResult = JSON.stringify(result);
        ws.send(parsedResult);

        this._simulations.delete(ws);
      });

      ws.send("CONNECTED");
    });
  }
}

export class ServerAdapter extends UIAdapter {
  public websocket: ws.WebSocket;

  constructor(config: Config, websocket: ws.WebSocket) {
    super(config);

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

  emitHandler(event: UIEvent) {
    const json = this.stringifyEvent(event);

    if (this.websocket.readyState !== this.websocket.OPEN) {
      return Promise.resolve();
    }

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
