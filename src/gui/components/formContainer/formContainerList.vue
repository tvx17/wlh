<template>
  -{{ props.form}}-
  {{variables.splitter}}
  <q-splitter v-model="variables.splitter.value" :limits="[0, 100]">
    <template v-slot:before>
      {{ props.form }}
      <q-btn-group class="full-width" flat>
        <e-form-button visible :available="variables.buttons.add.value" icon="fa-solid fa-plus" @click="on.add" />
        <e-form-button visible :available="variables.buttons.edit.value" icon="fa-solid fa-edit" @click="on.edit" />
        <e-form-button visible :available="variables.buttons.delete.value" icon="fa-solid fa-trash" @click="on.delete" />
        <e-form-button visible :available="variables.buttons.cancel.value" icon="fa-solid fa-ban" @click="on.cancel" />
      </q-btn-group>
      <list />
    </template>
    <template v-slot:after>
      <q-btn class="full-width"
             dense
             flat
             icon="fa-solid fa-save"
             size="sm"
             @click="on.save" />
      <books v-if="props.form === 'books'" />
      <projects v-if="props.form === 'projects'" />
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
import {useformContainerList} from 'src/gui/components/formContainer/formContainerList';

// -------------------------- Component-Imports
// ============================================
import eFormButton from 'src/gui/components/formContainer/common/formButton.vue'
import list from 'src/gui/components/formContainer/formList.vue';

// -------------------------- Forms
// ================================
import books from 'src/gui/forms/books.vue';
import projects from 'src/gui/forms/projects.vue';

// -------------------------- Vue & Quasar-Imports
// ======================================
import { onMounted, watch } from 'vue';

// -------------------------- Props
// ================================
const props = defineProps(
  {
    form: {
      type: String,
      required: true,
      default: ''
    }
  });

const {variables, methods, on} = useformContainerList();

// -------------------------- Watcher
// ==================================

watch(() => props.form, async () => {
  await methods.loadDatasets(props.form);
});

// -------------------------- Lifecycle-Hooks
// ==========================================
onMounted(async () => {
  await methods.loadDatasets(props.form);
  console.log('formContainerList mounted');
  methods.test()
});

</script>
<style>
@import '../../../../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../../../../node_modules/@syncfusion/ej2-vue-layouts/styles/material.css';
</style>
