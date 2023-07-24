<template>
  <q-form class="q-gutter-md">
    {{props.currentEditId}}
    <q-input
      dense
      v-model="formData.summary"
      :rules="[ val => val && val.length > 0 || 'Feld darf nicht leer sein']"
      label="Projektname"
      lazy-rules/>
    <q-expansion-item label="Beschreibung" dense default-opened>
      <q-editor v-model="formData.description"/>
    </q-expansion-item>
    <q-select
      dense
      v-model="formData.owner"
      :options="owners"
      option-value="currentEditId"
      option-label="summary"
      emit-value
      map-options
      label="Besitzer/-in"/>
    <q-checkbox
      :disable="!props.id"
      v-model="formData.isActive" dense
      :label="  formData.isActive ? 'Projekt ist aktiv' : 'Projekt ist nicht aktiv'"/>

  </q-form>
</template>

<script setup>
import {onMounted, ref} from "vue";
/*import crud from "src/app/crud";*/

const props = defineProps({
  id: {type: Number, required: false, default: null},
})

const datatable = 'projects'

const formData = ref({
  summary: '',
  description: '',
  owner: null,
  isActive: true
})
const owners = ref([]);

/*const onSave = async () => {
  await crud.save({datatable: datatable, data: dataset.value})
}*/

onMounted(async () => {
  /*owners.value = await crud.r({table: 'users'})
  if (props.currentEditId) {
    dataset.value = await crud.r({table: datatable, currentEditId: props.currentEditId})
  }
*/

})
</script>
