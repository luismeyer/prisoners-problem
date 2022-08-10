import http from "http";
import ws from "ws";

import { SimpleBox } from "./Box";
import { Config } from "./Config";
import { SimpleInmate } from "./Inmate";
import { Simulation, SimulationResult } from "./Simulation";
import { Loop, Random } from "./Strategy";
import { UIAdapter, UIEvent } from "./UIAdapter";

type StartMessage = {
  problemCount?: unknown;
  strategy?: unknown;
  simulationCount?: unknown;
  simulationSpeed?: unknown;
};

type ApiEvent = {
  currentInmate: SimpleInmate | undefined;
  currentBox: SimpleBox | undefined;
  openBoxes: SimpleBox[];
  closedBoxes: SimpleBox[];
};

type ApiMessage = UpdateMessage | ResultMessage | ConnectMessage | RunningMessage;

type ConnectMessage = {
  type: "connected";
  data: "success";
};

type UpdateMessage = {
  type: "update";
  data: ApiEvent;
};

type ResultMessage = {
  type: "done";
  data: SimulationResult;
};

type RunningMessage = {
  type: "running";
  data: "success";
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
      const { problemCount, simulationCount, strategy, simulationSpeed } = payload;

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

  private sendToWebsocket(ws: ws.WebSocket) {
    return (data: ApiMessage) => ws.send(JSON.stringify(data));
  }

  public start() {
    const wss = new ws.Server({ server: this._server });

    wss.on("connection", (ws) => {
      const send = this.sendToWebsocket(ws);

      ws.on("close", () => {
        const simulation = this._simulations.get(ws);

        simulation?.stop();
      });

      ws.on("message", async (message) => {
        const simulation = this._simulations.get(ws);

        const payload = message.toString();

        if (simulation && payload === "STOP") {
          simulation.stop();
          this._simulations.delete(ws);
          return;
        }

        if (simulation) {
          send({ type: "running", data: "success" });
          return;
        }

        const config = this.parseConfig(payload);

        const adapter = new ServerAdapter(config, ws);
        config.UI_ADAPTER = adapter;

        const newSimulation = new Simulation(config);
        this._simulations.set(ws, newSimulation);

        const result = await newSimulation.start();

        send({ type: "done", data: result });

        this._simulations.delete(ws);
      });

      send({ type: "connected", data: "success" });
    });
  }
}

export class ServerAdapter extends UIAdapter {
  public websocket: ws.WebSocket;

  constructor(config: Config, websocket: ws.WebSocket) {
    super(config);

    this.websocket = websocket;
  }

  private simplifyEvent(event: UIEvent): ApiEvent {
    const closedBoxes = event.closedBoxes.map((box) => box.simplify());
    const openBoxes = event.openBoxes.map((box) => box.simplify());
    const currentBox = event.currentBox?.simplify();

    const currentInmate = event.currentInmate?.simplify();

    return {
      currentInmate,
      currentBox,
      openBoxes,
      closedBoxes,
    };
  }

  private stringifyMessage(message: UpdateMessage): string {
    return JSON.stringify(message);
  }

  emitHandler(event: UIEvent) {
    const simpleEvent = this.simplifyEvent(event);

    const json = this.stringifyMessage({ type: "update", data: simpleEvent });

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
