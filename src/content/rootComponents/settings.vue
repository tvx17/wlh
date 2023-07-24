<template>
  <div class="q-gutter-y-xs">
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
        <q-tab name="mails" label="Projekte" />
        <q-tab name="userAccounts" label="Nutzerkonten" />
        <q-tab name="movies" label="Programmeinstellungen" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="mails">
          <div class="text-h6">Projekte</div>

        </q-tab-panel>

        <q-tab-panel name="userAccounts">
          <widget
              icon="fa-solid fa-user"
              label="Nutzerkonten"
              datatable="users"
              mode="both"
              use-splitter
              flat
              dense
            />
        </q-tab-panel>

        <q-tab-panel name="movies">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

const widget = defineAsyncComponent({
  loader: () => import('src/content/elements/widget.vue'),
});

const tab = ref('userAccounts');
</script>
