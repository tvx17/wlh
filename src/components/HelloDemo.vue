<template>
  <p v-if="ready">{{ t("co.hallo.greeting") }}</p>
  <p v-else-if="error" role="alert">{{ String(error) }}</p>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useTranslationResource } from "@/composables/useTranslationResource";
const { t } = useI18n();
const { ready, error } = useTranslationResource("co.hallo", "components/hallo");
</script>
