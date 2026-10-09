<template>
  <section class="q-mt-lg" aria-label="Dynamic translations">
    <div class="row q-gutter-sm justify-center">
      <q-btn
        v-for="language in ['en', 'de', 'xx']"
        :key="language"
        :label="language"
        :outline="locale !== language"
        :loading="busy && targetLanguage === language"
        :disable="busy"
        color="primary"
        @click="switchLanguage(language)"
      />
    </div>
    <p v-if="ready" class="q-mt-md text-center" aria-live="polite">
      {{ t("eins.welcome", { name: "Quasar" }) }}
    </p>
    <p v-if="error" role="alert" class="text-negative">{{ error }}</p>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useLangData } from "@/composables/useLangData";

const { t, locale, loadLangData, changeLanguage } = useLangData();
const ready = ref(false);
const busy = ref(true);
const targetLanguage = ref("");
const error = ref("");

function reportError(cause: unknown) {
  error.value = cause instanceof Error ? cause.message : String(cause);
}

onMounted(async () => {
  try {
    await loadLangData("eins", "components", "eins");
    ready.value = true;
  } catch (cause) {
    reportError(cause);
  } finally {
    busy.value = false;
  }
});

async function switchLanguage(language: string) {
  busy.value = true;
  targetLanguage.value = language;
  error.value = "";
  try {
    await changeLanguage(language);
  } catch (cause) {
    reportError(cause);
  } finally {
    busy.value = false;
  }
}
</script>
