<template>
  <p v-if="ready">{{ t("hallo.greeting") }}</p>
  <p v-else-if="error" role="alert">{{ error }}</p>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useLangData } from "@/core/composables/useLangData";
const { t, loadLangData } = useLangData();
const ready = ref(false);
const error = ref("");
onMounted(async () => {
  try {
    await loadLangData("hallo", "components", "hallo");
    ready.value = true;
  } catch (cause) {
    error.value = String(cause);
  }
});
</script>
