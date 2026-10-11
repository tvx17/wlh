<template>
  <q-page padding>
    <div class="tw:mx-auto tw:max-w-2xl tw:space-y-6">
      <h1 class="text-h4">{{ t("app.title") }}</h1>
      <q-select
        v-model="selectedLocale"
        :options="['de-de', 'en-us']"
        :label="t('app.language')"
        :disable="switching"
        @update:model-value="switchLanguage"
      />
      <p v-if="failure" role="alert">{{ failure }}</p>
      <HelloDemo v-if="showHello" />
      <q-btn :label="t('app.toggle')" @click="showHello = !showHello" />
      <q-card flat bordered>
        <q-card-section class="tw:space-y-4">
          <h2 class="text-h6">{{ t("app.backend") }}</h2>
          <q-input v-model="text" :label="t('app.message')" maxlength="2000" />
          <q-btn
            :label="t('app.send')"
            color="primary"
            :disable="!desktopAvailable"
            :loading="sending"
            @click="send"
          />
          <p v-if="!desktopAvailable">{{ t("app.browser") }}</p>
          <pre v-if="response" class="tw:whitespace-pre-wrap">{{
            response
          }}</pre>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { translations } from "@/i18n";
import HelloDemo from "@/components/HelloDemo.vue";
import type { EchoResponse } from "@/shared/desktop";
const { t, locale } = useI18n();
const showHello = ref(true);
const text = ref("Hallo Electron!");
const response = ref<EchoResponse>();
const failure = ref("");
const sending = ref(false);
const desktopAvailable = typeof window.desktop !== "undefined";
// Use a separate selection so loading failures do not activate an unloaded locale.
const selectedLocale = ref(locale.value);
const switching = ref(false);
async function switchLanguage(value: string) {
  switching.value = true;
  try {
    await translations.setLocale(value);
    failure.value = "";
  } catch (error) {
    selectedLocale.value = locale.value;
    failure.value = String(error);
  } finally {
    switching.value = false;
  }
}
async function send() {
  if (!window.desktop) return;
  sending.value = true;
  try {
    response.value = await window.desktop.echo(text.value);
    failure.value = "";
  } catch (error) {
    failure.value = String(error);
  } finally {
    sending.value = false;
  }
}
</script>
