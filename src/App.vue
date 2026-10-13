<template>
  <router-view v-if="ready" />
  <div
    v-else
    class="tw:flex tw:min-h-screen tw:flex-col tw:items-center tw:justify-center tw:gap-4"
  >
    <h1>Quasar App</h1>
    <q-spinner v-if="!failed" color="primary" size="24px" />
    <div v-else role="alert" class="tw:text-center">
      <p>Sprachdaten nicht erreichbar · Translations unavailable</p>
      <q-btn no-caps outline label="Erneut versuchen · Retry" @click="load" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useLangData } from "@/core/composables/useLangData";

const { loadLangData, locale } = useLangData();
watch(
  locale,
  value => {
    document.documentElement.lang = value;
  },
  { immediate: true }
);
const ready = ref(false);
const failed = ref(false);
async function load() {
  failed.value = false;
  try {
    await loadLangData("app", "", "app");
    ready.value = true;
  } catch {
    failed.value = true;
  }
}
void load();
</script>
