<!--
 Copyright 2024 NTT Corporation.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->

<template>
  <v-container class="mt-0 pt-0">
    <v-row>
      <v-col class="pt-0">
        <h4>{{ $t("speech-recognition.config.subtitle") }}</h4>

        <v-checkbox
          v-model="isEnabled"
          :label="$t('speech-recognition.config.enabled')"
          :disabled="isCapturing || isReplaying"
          hide-details
          class="py-0 my-0"
        >
        </v-checkbox>

        <v-text-field
          v-model="serverUrl"
          :disabled="!isEnabled || isCapturing || isReplaying"
          class="ml-10"
          variant="underlined"
          :label="$t('speech-recognition.config.server-url')"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { useCaptureControlStore } from "@/stores/captureControl";
import { useExtSpeechRecognitionStore } from "../../../stores/extSpeechRecognition";
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const captureControlStore = useCaptureControlStore();
    const extSpeechRecognitionStore = useExtSpeechRecognitionStore();

    const isEnabled = computed({
      get: () => extSpeechRecognitionStore.settings.isEnabled,
      set: (isEnabled) => {
        extSpeechRecognitionStore.settings.isEnabled = isEnabled;
      }
    });
    const serverUrl = computed({
      get: () => extSpeechRecognitionStore.settings.serverUrl,
      set: (serverUrl) => {
        extSpeechRecognitionStore.settings.serverUrl = serverUrl;
      }
    });

    const isCapturing = computed(() => {
      return captureControlStore.isCapturing;
    });

    const isReplaying = computed(() => {
      return captureControlStore.isReplaying;
    });

    return { isCapturing, isReplaying, isEnabled, serverUrl };
  }
});
</script>
