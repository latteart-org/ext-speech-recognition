/**
 * Copyright 2024 NTT Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import Logger from "./Logger";
import { startRecording, stopRecording } from "./speecRecognitionService";
import { ConfigType } from "./utils";

export const startSocketServer = (config: ConfigType) => {
  const app = express();
  app.use(cors());
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );

    next();
  });
  const server = createServer(app);
  const io = new Server(server, {
    allowEIO3: true,
  });

  io.on("connection", (socket) => {
    socket.on("startRecording", () => startRecording(socket, config));
    socket.on("stopRecording", () => {
      socket.disconnect();
    });
    socket.on("disconnect", (reason: string) => {
      Logger.info(reason);
      stopRecording();
    });
  });

  const port = process.env.PORT || 3003;
  server.listen(port, () => {
    Logger.info(`server runnning at http://localhost:${port}`);
  });
};
