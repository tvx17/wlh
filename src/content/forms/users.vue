<template>
  <q-form class="q-pa-md" v-if="dataset">
    <q-input
      dense
      v-model="dataset.summary"
      :rules="[(val) => (val && val.length > 0) || 'Feld darf nicht leer sein']"
      label="Benutzername"
      lazy-rules
    />
    <q-input dense v-model="dataset.firstname" label="Vorname" />
    <q-input dense v-model="dataset.lastname" label="Nachname" />
    <q-input
      dense
      v-model="dataset.pseudonym"
      :rules="[(val) => (val && val.length > 0) || 'Feld darf nicht leer sein']"
      label="Pseudonym"
      lazy-rules
    />
    <q-select
      dense
      v-model="dataset.gender"
      :options="[{ id: 1, summary: 'männlich' }]"
      option-value="id"
      option-label="summary"
      emit-value
      map-options
      label="Geschlecht"
    />
    <q-checkbox
      :disable="!props.id"
      v-model="dataset.isActive"
      dense
      :label="
        dataset.isActive ? 'Benutzer ist aktiv' : 'Benutzer ist nicht aktiv'
      "
    />
    <div class="row">
      <div class="col"><button-save @on:click="onSaveData" /></div>
    </div>



  </q-form>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { loadData, onSave } from "src/app/formMethods";

import buttonSave from 'src/tvx/components/buttons/save.vue';
import buttonCancel from 'src/tvx/components/buttons/cancel.vue';

const props = defineProps({
  id: { type: Number, required: false, default: null },
  index: { type: Number, required: false },
});

const emit = defineEmits(['done:save']);

const datatable = 'users';

const dataset = ref({
  summary: '',
  firstname: '',
  lastname: '',
  pseudonym: '',
  gender: null,
  isActive: true,
});

watch(
  () => props.id,
  async(newValue) => {
    console.log('Cool, it has changed!');
    if (newValue > 0) {
      dataset.value = await loadData(datatable, props.id);
    } else {
      dataset.value = {};
    }
  }
);
const onSaveData = async () => {
  await onSave(datatable, dataset.value);
  emit('done:save');
  await loadData(datatable, props.id);
};


onMounted(async () => {
  if (props.id) {
    dataset.value = await loadData(datatable, props.id);
  }
});
</script>
