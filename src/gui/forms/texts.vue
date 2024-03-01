<template>

  <div class="q-pa-md">
    <e-display v-model="dataset.value.id"
               label="ID" />
    <e-input v-model="dataset.value.summary"
             label="Summary" />
    <q-separator />
    <q-editor v-model="dataset.value.data['text']" />
    <e-date-time :created-at="dataset.value.createdAt"
                 :updated-at="dataset.value.updatedAt" />
  </div>
</template>

<script lang="ts" setup>
import eDateTime from 'src/gui/elements/dateTime.vue';
import eDisplay from 'src/gui/elements/display.vue';
import eInput from 'src/gui/elements/input.vue';
import { inject } from 'vue';

const { dataset, setDataset } = inject('dataset');
</script>
