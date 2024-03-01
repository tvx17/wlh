import { Notify } from 'quasar';
// -------------------------- Constants-Imports
// ============================================
import { forms } from 'src/app/constants/forms';
import { useApp } from 'src/app/useApp';
import { useEntities } from 'src/app/useEntities';

import {useQuasar} from 'quasar';
const $q = useQuasar();

import variables from './variables';

// *********************************************************************************
// *********************************************************************************
// *********************************************************************************

const { crud, helper } = useApp();
const { common } = useEntities();


export const methods = {
  async loadDatasets(form: string) {
    variables.currentForm = forms[form]
    console.log(variables.currentForm)
    common.read(variables.currentForm.table).then((res: any) => {
      variables.datasets.value = res;
    });
  },
  setDataset(selectedId: any) {
    console.log('selectedId', selectedId);
    variables.dataset.value = variables.datasets.value[selectedId];
    variables.unchangedDataset = JSON.parse(JSON.stringify(variables.dataset.value));
    variables.splitter.value = 25;
    console.log(variables.splitter.value);
    console.log('dataset', variables.dataset.value);
  },

  async saveNewDataset(newSummary: string) {
    const id = await common.create(variables.currentForm.table, { summary: newSummary });
    console.log('New id is:', id);
    Notify.create(
      {
        color: 'positive',
        message: 'New dataset created'
      });
    variables.datasets.value.push({ id: id, summary: newSummary });
    variables.hasChanged.value = true;
  },
  tableReleatedSpecifics() {
    const returnData = {};
    switch (variables.currentForm.form) {
      case 'projects':
        returnData['iid'] = helper.createIID();
        break;
      default:
        throw new Error('table not found');
    }
    return returnData;
  },
  buildDataToSave() {
    const dataToSave = {};
    for (const [key, value] of Object.entries(variables.dataset.value)) {
      if (value !== variables.unchangedDataset[key]) {
        dataToSave[key] = value;
      }
    }
    return dataToSave;
  },
  hasChanges(dataToSave) {
    if (Object.keys(dataToSave).length === 0) {
      Notify.create(
        {
          color: 'warning',
          message: variables.dataset.value['id'] === -1 ? 'Please fill in at least one field' : 'No changes to save'
        });
      return false;
    }
    return true;
  },
  isUpdatedDataset(dataToSave) {
    common.update(variables.currentForm.table, dataToSave, { id: variables.dataset.value['id'] }).then((res) => {
      variables.datasets.value[variables.selectedRowIndex.value].summary = variables.dataset.value['summary'];
      Notify.create(
        {
          color: 'positive',
          message: 'Data saved'
        });
    });
  },
  saveRecord() {
    let dataToSave = methods.buildDataToSave();

    if (!methods.hasChanges(dataToSave)) {
      return;
    }
    dataToSave = methods.tableReleatedSpecifics(dataToSave);
    if (variables.dataset.value['id'] === -1) {
      methods.saveNewDataset(dataToSave);
    } else {
      methods.isUpdatedDataset(dataToSave);
    }
  },
  setStrings(addTitle: string, addMessage: string, deleteTitle: string, deleteMessage: string) {
    variables.strings.addTitle = addTitle;
    variables.strings.addMessage = addMessage;
    variables.strings.deleteTitle = deleteTitle;
    variables.strings.deleteMessage = deleteMessage;
  }
};

export const on = {
  add() {
    $q.dialog(
      {
        title: variables.strings.addTitle,
        message: variables.strings.addMessage,
        prompt: {
          model: '',
          type: 'text'
        },
        cancel: true,
        persistent: true
      }).onOk((newSummary: any) => {
      methods.saveNewDataset(newSummary);
    });
  },

  cancel() {
    variables.selectedRowIndex.value = -1;
    variables.splitter.value = 100;
  },
  save() {
    let dataToSave = methods.buildDataToSave();

    if (!methods.hasChanges(dataToSave)) {
      return;
    }
    dataToSave = methods.tableReleatedSpecifics(dataToSave);
    if (variables.dataset.value['id'] === -1) {
      methods.saveNewDataset(dataToSave);
    } else {
      methods.isUpdatedDataset(dataToSave);
    }
  },

  async delete() {
    $q.dialog({
                title: props.deleteTitle,
                message: props.deleteMessage,
                cancel: true,
                persistent: true
              }).onOk(async () => {
      await common.deleteOneById(variables.currentForm.table, variables.datasets.value[variables.selectedRowIndex.value]['id']);
      variables.datasets.value.splice(variables.selectedRowIndex.value, 1);
      Notify.create(
        {
          color: 'positive',
          message: 'Dataset deleted'
        });
      variables.dataset.value = {};
      variables.unchangedDataset = {};
      variables.hasChanged.value = true;
    });
  },
  edit() {
    variables.selectedRowIndex.value;
    variables.dataset.value = variables.datasets.value[variables.selectedRowIndex.value];
    variables.splitter.value = 25;
  },
  selected(args: any) {
    variables.selectedRowIndex.value = args.rowIndex;

    if (variables.selectedRowIndex.value === -1) {
      variables.buttons.cancel.value = false;
      variables.buttons.delete.value = false;
      variables.buttons.edit.value = false;
      variables.buttons.save.value = false;
    } else {
      variables.buttons.cancel.value = true;
      variables.buttons.edit.value = true;
      variables.buttons.delete.value = variables.currentForm.minDatasets < variables.datasets.value.length;
    }
  },
  deselected(args: any) {
    variables.selectedRowIndex.value = -1;
    variables.buttons.edit.value = false;
    variables.buttons.cancel.value = false;
    variables.dataset.value = {};
    variables.splitter.value = 100;
    //gridReference.value.refresh();
  }
};

