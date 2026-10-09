<template>
  <q-page class="flex flex-center">
    <div class="column items-center">
      <img
        alt="Quasar logo"
        src="~@/assets/quasar-logo-vertical.svg"
        style="width: 200px; height: 200px"
      />
      <LanguageDataExample />

      <q-btn
        class="q-mt-md"
        color="primary"
        to="/second"
        label="Go to Second Page"
        no-caps
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import LanguageDataExample from "@/components/LanguageDataExample.vue";
</script>
