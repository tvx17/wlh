<template>
  <div v-if="nonListForms.includes(props.form)">
    <settings v-if="props.form === 'settings'" />
  </div>
  <div v-else>
    <q-splitter v-model="splitter" :limits="[0, 100]">
      <template v-slot:before>
        {{ props.form }}
        <form-buttons :add-available="buttons.add.value"
                      :cancel-available="buttons.cancel.value"
                      :delete-available="buttons.delete.value"
                      :edit-available="buttons.edit.value"
                      add
                      cancel
                      delete
                      edit
                      @click="onClick" />
        <list :has-changed="hasChanged" @updata:has-changed="setHasChanged" />
      </template>
      <template v-slot:after>
        <q-btn class="full-width" dense flat icon="fa-solid fa-save" size="sm" @click="onClick('save')" />
        <books v-if="props.form === 'books'" />
        <projects v-if="props.form === 'projects'" />
      </template>
    </q-splitter>
  </div>
</template>

<script lang="ts" setup>
import { Notify, useQuasar } from 'quasar';
// -------------------------- Constants-Imports
// ============================================
import { forms } from 'src/app/constants/forms';

// -------------------------- App-Imports
// ======================================
import { useApp } from 'src/app/useApp';
import { useEntities } from 'src/app/useEntities';

// -------------------------- Component-Imports
// ============================================
import formButtons from 'src/gui/components/formContainer/common/formButtons.vue';
import list from 'src/gui/components/formContainer/formList.vue';

// -------------------------- Forms
// ================================
import books from 'src/gui/forms/books.vue';
import projects from 'src/gui/forms/projects.vue';
import settings from 'src/gui/forms/settings.vue';


// -------------------------- Vue & Quasar-Imports
// ======================================
import { onMounted, provide, ref, watch } from 'vue';


// -------------------------- Props
// ================================
const props = defineProps(
  {
    form: {
      type: String,
      required: true,
      default: ''
    },
    addTitle: {
      type: String,
      default: 'Add a new record'
    },
    addMessage: {
      type: String,
      default: 'Please enter the summary of the new record'
    },
    deleteTitle: {
      type: String,
      default: 'Delete selected record'
    },
    deleteMessage: {
      type: String,
      default: 'Do you really want to delete the selected record?'
    }
  });

// -------------------------- Watcher
// ==================================

watch(() => props.form, async () => {
  await loadDatasets();
});

// -------------------------- Reactive Variables
// =============================================

const datasets = ref([]);
provide('datasets', datasets);
const dataset = ref({});
provide('dataset', { dataset, setDataset });
const selectedRowIndex = ref(-1);
provide('selectedRowIndex', { selectedRowIndex, setSelectedRowIndex });

const splitter = ref(100);
const buttons = {
  add: ref(true),
  cancel: ref(false),
  delete: ref(false),
  edit: ref(false),
  save: ref(false)
};
const hasChanged = ref(false);

// -------------------------- Variables
// ====================================
let unchangedDataset = {};

// -------------------------- Constants
// ====================================
const { crud, helper } = useApp();
const { common } = useEntities();
const $q = useQuasar();
const nonListForms = ['settings'];

// -------------------------- Methods
// ==================================
function setHasChanged(value: boolean) {
  hasChanged.value = value;
}

async function loadDatasets() {
  common.read(forms[props.form]['form']).then((res: any) => {
    datasets.value = res;
  });
}

function setDataset(selectedId: any) {
  dataset.value = datasets.value[selectedId];
  unchangedDataset = JSON.parse(JSON.stringify(dataset.value));
  splitter.value = 25;
}

function setSelectedRowIndex(data: any) {
  selectedRowIndex.value = data;
  if (data === -1) {
    buttons.cancel.value = false;
    buttons.delete.value = false;
    buttons.edit.value = false;
    buttons.save.value = false;
  } else {
    buttons.cancel.value = true;
    buttons.edit.value = true;
    buttons.delete.value = forms[props.form]['minDatasets'] < datasets.value.length;
  }
}

function onClick(buttonName: string) {
  switch (buttonName) {
    case 'add':
      addNewRecord();
      break;
    case 'cancel':
      setSelectedRowIndex(-1);
      splitter.value = 100;
      break;
    case 'delete':
      deleteRecord();
      break;
    case 'edit':
      buttons.save.value = true;
      setDataset(selectedRowIndex.value);
      break;
    case 'save':
      saveRecord();
      break;
  }
}

function addNewRecord() {
  $q.dialog(
    {
      title: props.addTitle,
      message: props.addMessage,
      prompt: {
        model: '',
        type: 'text'
      },
      cancel: true,
      persistent: true
    }).onOk((newSummary: any) => {
    saveNewDataset(newSummary);
  });
}

async function saveNewDataset(newSummary: string) {
  let id = await common.create(forms[props.form]['form'], { summary: newSummary });
  console.log('New id is:', id);
  Notify.create(
    {
      color: 'positive',
      message: 'New dataset created'
    });
  datasets.value.push({ id: id, summary: newSummary });
  hasChanged.value = true;
}

async function deleteRecord() {
  $q.dialog({
              title: props.deleteTitle,
              message: props.deleteMessage,
              cancel: true,
              persistent: true
            }).onOk(async () => {
    await common.deleteOneById(forms[props.form]['form'], datasets.value[selectedRowIndex.value]['id']);
    datasets.value.splice(selectedRowIndex.value, 1);
    Notify.create(
      {
        color: 'positive',
        message: 'Dataset deleted'
      });
    dataset.value = {};
    unchangedDataset = {};
    hasChanged.value = true;
  });
}


function tableReleatedSpecifics() {
  const returnData = {};
  switch (forms[props.form]['form']) {
    case 'projects':
      returnData['iid'] = helper.createIID();
      break;
    default:
      throw new Error('table not found');
  }
  return returnData;
}

function buildDataToSave() {
  const dataToSave = {};
  for (const [key, value] of Object.entries(dataset.value)) {
    if (value !== unchangedDataset[key]) {
      dataToSave[key] = value;
    }
  }
  return dataToSave;
}

function hasChanges(dataToSave) {
  if (Object.keys(dataToSave).length === 0) {
    Notify.create(
      {
        color: 'warning',
        message: dataset.value['id'] === -1 ? 'Please fill in at least one field' : 'No changes to save'
      });
    return false;
  }
  return true;
}

function isUpdatedDataset(dataToSave) {
  common.update(forms[props.form]['form'], dataToSave, { id: dataset.value['id'] }).then((res) => {
    datasets.value[selectedRowIndex.value].summary = dataset.value['summary'];
    Notify.create(
      {
        color: 'positive',
        message: 'Data saved'
      });
  });
}

function saveRecord() {
  const dataToSave = buildDataToSave();

  if (!hasChanges(dataToSave)) {
    return;
  }
  dataToSave = tableReleatedSpecifics(dataToSave);
  if (dataset.value['id'] === -1) {
    saveNewDataset(dataToSave);
  } else {
    isUpdatedDataset(dataToSave);
  }
}

// -------------------------- Lifecycle-Hooks
// ==========================================
onMounted(async () => {
  await loadDatasets();
});

</script>
<style>
@import '../../../../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../../../../node_modules/@syncfusion/ej2-vue-layouts/styles/material.css';
</style>
