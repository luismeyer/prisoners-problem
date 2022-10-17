import http from "http";
import ws from "ws";
import { ApiResponse, StartRequest, StatsResponse, UpdateResponse, ApiRequest } from "@prisoners-problem/api";

import { Config } from "./Config";
import { Simulation } from "./Simulation";
import { Loop, Random } from "./Strategy";
import { UIAdapter, UISimulationUpdate, UIStatsUpdate, UIUpdate } from "./UIAdapter";

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

  constructor(config: Config, websocket: ws.WebSocket) {
    super(config);

    this.websocket = websocket;
  }

  private createStatsUpdate(update: UIStatsUpdate): StatsResponse {
    return {
      type: "stats",
      data: {
        failRate: update.failRate,
        fails: update.fails,
      },
    };
  }

  private createSimulationUpdate(update: UISimulationUpdate): UpdateResponse {
    const closedBoxes = update.closedBoxes.map((box) => box.simplify());
    const openBoxes = update.openBoxes.map((box) => box.simplify());
    const currentBox = update.currentBox?.simplify();

    const currentInmate = update.currentInmate?.simplify();

    return {
      type: "update",
      data: {
        currentInmate,
        currentBox,
        openBoxes,
        closedBoxes,
      },
    };
  }

  private createUpdateResponse(update: UIUpdate): ApiResponse {
    if (update.type === "sim") {
      return this.createSimulationUpdate(update);
    }

    if (update.type === "stats") {
      return this.createStatsUpdate(update);
    }

    return { type: "running", data: "success" };
  }

  private stringifyMessage(message: unknown): string {
    return JSON.stringify(message);
  }

  public emitHandler(event: UIUpdate) {
    const response = this.createUpdateResponse(event);

    const json = this.stringifyMessage(response);

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
