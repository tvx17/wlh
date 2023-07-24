<template>
  <div class="q-gutter-y-xs" >
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="books" label="Bücher" disable/>
        <q-tab name="characters" label="Charaktere" disable/>
        <q-tab name="objects" label="Objekte" disable/>
        <q-tab name="locations" label="Orte" disable/>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="books">
          <div class="text-h6">Bücher</div>
          Not yet implemented
        </q-tab-panel>
        <q-tab-panel name="characters">
          <div class="text-h6">Charaktere</div>
          Not yet implemented
        </q-tab-panel>

        <q-tab-panel name="objects">
          <div class="text-h6">Objekte</div>
          Not yet implemented
        </q-tab-panel>

        <q-tab-panel name="locations">
          <div class="text-h6">Orte</div>
          Not yet implemented
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

const tab = ref('book');

/*const widget = defineAsyncComponent({
  loader: () => import('src/content/elements/widget.vue'),
});*/
</script>
