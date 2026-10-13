<template>
  <div class="page-content">
    <q-btn color="primary" to="/" :label="t('studio.home')" no-caps />
  </div>
</template>

<script setup lang="ts">
import { useStudioText } from "@/core/composables/useStudioText";
const { t } = useStudioText();
</script>
