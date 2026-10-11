<template>
  <div class="not-found">
    <span>FOLIO / 404</span>
    <h1>{{ t("studio.notFound") }}</h1>
    <q-btn
      color="primary"
      unelevated
      to="/"
      :label="t('studio.home')"
      no-caps
    />
  </div>
</template>
<script setup lang="ts">
import { useStudioText } from "@/core/composables/useStudioText";
const { t } = useStudioText();
</script>
