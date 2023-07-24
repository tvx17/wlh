<template>
  <div v-if="!props.id">Es wurde keine ID übergaben</div>
  <div v-if="props.id">
    <q-form class="q-gutter-md" v-if="dataset">
      <q-input
        dense
        v-model="dataset.summary"
        :rules="[
          (val) => (val && val.length > 0) || 'Feld darf nicht leer sein',
        ]"
        label="Name"
        lazy-rules
      />
      <q-expansion-item label="Beschreibung" dense default-opened>
        <q-editor v-model="dataset.description" />
      </q-expansion-item>
      <q-checkbox
        :disable="!props.id"
        v-model="dataset.isActive"
        dense
        :label="dataset.isActive ? 'Buch ist aktiv' : 'Buch ist nicht aktiv'"
      />
      <button-save @on:click="onSaveData" />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { loadData, onSave } from 'src/app/formMethods';

import buttonSave from 'src/tvx/components/buttons/save.vue';

const props = defineProps({
  id: { type: Number, required: false, default: null },
  index: { type: Number, required: false },
});

const emit = defineEmits(['on:save']);

const datatable = 'books';

const newData = {
  summary: '',
  description: '',
  isActive: true,
};

const dataset = ref({});

watch(
  () => props.id,
  async (newValue) => {
    if (newValue > 0) {
      dataset.value = await loadData(datatable, props.id);
    } else {
      dataset.value = newData;
    }
  }
);
const onSaveData = async () => {
  await onSave(datatable, dataset.value);
  emit('on:save');
  await loadData(datatable, props.id);
};

onMounted(async () => {
  if (props.id) {
    dataset.value = await loadData(datatable, props.id);
  }
});
</script>
