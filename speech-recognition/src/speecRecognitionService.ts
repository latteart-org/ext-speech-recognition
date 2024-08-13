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
// @ts-ignore
import vosk from "vosk";
import { Socket } from "socket.io";
import Logger from "./Logger";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { soxArgs } from "./constants";
import { ConfigType } from "./utils";

let soxProcess: ChildProcessWithoutNullStreams | null = null;

export const startRecording = (socket: Socket, config: ConfigType) => {
  Logger.info("start recording");
  Logger.info(config);

  if (soxProcess !== null) {
    Logger.error("Already starting up");
    return;
  }

  if (!config.modelPath) {
    Logger.error(`invalid modelPath: ${config.modelPath}`);
    process.exit();
  }

  vosk.setLogLevel(config.voskLogLevel | 1);
  const model = new vosk.Model(config.modelPath);

  const rec = new vosk.Recognizer({
    model: model,
    sampleRate: config.sampleRate | 16000,
  });

  soxProcess = spawn("sox", soxArgs);
  soxProcess.stdout.on("data", (data) => {
    if (rec.acceptWaveform(data)) {
      const result = rec.result();
      if (result.text !== "") {
        const message = { text: result.text, timestamp: new Date().getTime() };
        Logger.info(message);
        socket.emit("message", JSON.stringify(message));
      }
    } else {
      const partialResult = rec.partialResult();
      Logger.debug(partialResult);
    }
  });
  soxProcess.on("error", (error) => {
    Logger.error(`Error executing Sox: ${error.message}`);
  });
  soxProcess.on("SIGINT", () => {
    Logger.info("stop recording");
    if (soxProcess !== null) {
      soxProcess.kill();
      soxProcess = null;
    }
  });
};

export const stopRecording = () => {
  Logger.info("stop");
  if (soxProcess !== null) {
    soxProcess.kill();
    soxProcess = null;
  }
};
