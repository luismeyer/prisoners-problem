import http from "http";
import ws from "ws";
import { ApiResponse, StartRequest, ApiSimulation, UpdateResponse, ApiRequest } from "@prisoners-problem/api";

import { Config } from "./Config";
import { Simulation } from "./Simulation";
import { Loop, Random } from "./Strategy";
import { UIAdapter, UIEvent } from "./UIAdapter";

export class WebSocketServer {
  private _server: http.Server;

  private _simulations: WeakMap<ws.WebSocket, Simulation>;

  constructor(server: http.Server) {
    this._server = server;
    this._simulations = new WeakMap();
  }

  private parseConfig(payload: StartRequest) {
    try {
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

  private createSendToWebsocket(ws: ws.WebSocket) {
    return (data: ApiResponse) => ws.send(JSON.stringify(data));
  }

  public start() {
    const wss = new ws.Server({ server: this._server });

    wss.on("connection", (ws) => {
      const send = this.createSendToWebsocket(ws);

      ws.on("close", () => {
        const simulation = this._simulations.get(ws);

        simulation?.stop();
      });

      ws.on("message", async (message) => {
        const simulation = this._simulations.get(ws);

        const payload: ApiRequest = JSON.parse(message.toString());

        if (simulation && payload.type === "stop") {
          simulation.stop();
          this._simulations.delete(ws);

          return;
        }

        if (simulation) {
          send({ type: "running", data: "success" });
          return;
        }

        if (payload.type !== "start") {
          console.error("Wrong payload ", payload);

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

  private _messageCounter = 0;

  constructor(config: Config, websocket: ws.WebSocket) {
    super(config);

    this.websocket = websocket;
  }

  private simplifyEvent(event: UIEvent): ApiSimulation {
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

  private stringifyMessage(message: UpdateResponse): string {
    return JSON.stringify(message);
  }

  emitHandler(event: UIEvent) {
    const simpleEvent = this.simplifyEvent(event);

    const json = this.stringifyMessage({ type: "update", message: this._messageCounter, data: simpleEvent });

    this._messageCounter = this._messageCounter + 1;

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
