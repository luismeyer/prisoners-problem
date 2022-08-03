import express from "express";
import http from "http";

import { WebSocketServer } from "./Websocket";

//initialize a simple http server
const server = http.createServer();

const websocketServer = new WebSocketServer(server);
websocketServer.start();

const port = 8080;

server.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
