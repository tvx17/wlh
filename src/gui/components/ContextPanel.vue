<template>
  <aside class="context-panel" :aria-label="title">
    <div class="panel-heading">
      <span class="eyebrow">{{ title }}</span>
      <q-btn
        flat
        round
        dense
        icon="close"
        size="sm"
        :aria-label="t('studio.close')"
        @click="$emit('close')"
      />
    </div>
    <slot />
  </aside>
</template>
<script setup lang="ts">
import { useStudioText } from "@/core/composables/useStudioText";
defineProps<{ title: string }>();
defineEmits<{ close: [] }>();
const { t } = useStudioText();
</script>
