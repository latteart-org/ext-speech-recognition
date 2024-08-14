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

import { defineStore } from "pinia";
import type { SpeechRecognitionSettings } from "../lib/type";
import { SpeechRecognitionServerAdapter } from "../lib/speechRecognitionServerAdapter";
import { useOperationHistoryStore } from "@/stores/operationHistory";
import { useRootStore } from "@/stores/root";

/**
 * State for ext speech recognition.
 */
export type ExtSpeechRecognitionState = {
  /**
   * Setting.
   */
  settings: SpeechRecognitionSettings;

  /**
   * Speech Recognition server adapter.
   */
  speechRecognitionServerAdapter: SpeechRecognitionServerAdapter | null;
};

export const useExtSpeechRecognitionStore = defineStore("extSpeechRecognition", {
  state: (): ExtSpeechRecognitionState => ({
    settings: { isEnabled: false, serverUrl: "http://127.0.0.1:3003" },
    speechRecognitionServerAdapter: null
  }),
  actions: {
    async startRecording(callbacks: { onEnd: (error?: Error) => void }) {
      if (!this.settings.isEnabled) {
        return;
      }

      const rootStore = useRootStore();
      const operationHistoryStore = useOperationHistoryStore();

      try {
        const serverUrl = new URL(this.settings.serverUrl);
        const speechRecognitionServerAdapter = new SpeechRecognitionServerAdapter(
          serverUrl.toString()
        );

        await speechRecognitionServerAdapter.startRecording({
          onRecognize: async (data?: unknown) => {
            const { text, timestamp } = data as { text: string; timestamp: number };
            await operationHistoryStore.addComment({ comment: text, timestamp });
          },
          onEnd: (error) => {
            this.speechRecognitionServerAdapter = null;

            if (!error) {
              callbacks.onEnd();
              return;
            }

            console.error(error);
            const errorMessage = rootStore.message(`speech-recognition.error.disconnected`);
            callbacks.onEnd(new Error(errorMessage));
          }
        });

        this.speechRecognitionServerAdapter = speechRecognitionServerAdapter;
      } catch (error) {
        console.error(error);
        const errorMessage = rootStore.message(`speech-recognition.error.connection-failed`);
        callbacks.onEnd(new Error(errorMessage));
      }
    },

    stopRecording() {
      if (!this.speechRecognitionServerAdapter) {
        return;
      }

      try {
        this.speechRecognitionServerAdapter.stopRecording();
      } finally {
        this.speechRecognitionServerAdapter = null;
      }
    }
  }
});
