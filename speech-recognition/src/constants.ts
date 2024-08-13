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
import { platform } from "os";

const soxInputPlatformDic = {
  win32: "waveaudio",
  linux: "pulseaudio",
  darwin: "coreaudio",
};

export const soxArgs = [
  "-b",
  "16",
  "--endian",
  "little",
  "-c",
  "1",
  "-r",
  "16k",
  "-e",
  "signed-integer",
  "-t",
  soxInputPlatformDic[platform() as "win32" | "linux" | "darwin"],
  "default",
  "-t",
  "wav",
  "-",
];
