import { Dialog, Notify } from 'quasar';
import cForms, { IForm } from 'src/app/constants/forms';
import { common } from 'src/app/entities';
import { methods } from 'src/gui/components/formContainer/list/methods';
import { onMounted, ref } from 'vue';

const v = {
  form: '',
  unchangedDataset: {},
  splitter: ref(100),
  datasets: ref([]),
  dataset: ref({}),
  selectedRowIndex: ref(-1),
  buttons: {
    add: ref(true),
    cancel: ref(false),
    delete: ref(false),
    edit: ref(false),
    save: ref(false)
  },
  currentForm: <IForm>{
    minDatasets: 0,
    form: '',
    header: '',
    type: '',
    table: ''
  },
  strings: {
    addTitle: 'Add new dataset',
    addMessage: 'Enter the name of the new dataset',
    deleteTitle: 'Delete dataset',
    deleteMessage: 'Are you sure you want to delete this dataset?'
  }
};
const m = {
  async loadDatasets() {
    console.log(v.currentForm)
    common(v.currentForm.table).readAll().then((res: any) => {
      v.datasets.value = res;
    });
  }
};

const on = {
  async delete() {
    Dialog.create(
      {
        title: v.strings.deleteTitle,
        message: v.strings.deleteMessage,
        cancel: true,
        persistent: true
      }).onOk(async () => {
      await common(v.currentForm.table).deleteOneById(v.datasets.value[v.selectedRowIndex.value]['id']);
      v.datasets.value.splice(v.selectedRowIndex.value, 1);
      Notify.create(
        {
          color: 'positive',
          message: 'Dataset deleted'
        });
      v.dataset.value = {};
      v.unchangedDataset = {};
    });
  },
  add() {
    console.log('add');
    Dialog.create(
      {
        title: v.strings.addTitle,
        message: v.strings.addMessage,
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
    v.selectedRowIndex.value = -1;
    v.splitter.value = 100;
  },
  edit() {
    v.selectedRowIndex.value;
    v.dataset.value = v.datasets.value[v.selectedRowIndex.value];
    v.splitter.value = 25;
  },
  selected(args: any) {
    v.selectedRowIndex.value = args.rowIndex;

    if (v.selectedRowIndex.value === -1) {
      v.buttons.cancel.value = false;
      v.buttons.delete.value = false;
      v.buttons.edit.value = false;
      v.buttons.save.value = false;
    } else {
      v.buttons.cancel.value = true;
      v.buttons.edit.value = true;
      v.buttons.delete.value = v.currentForm.minDatasets < v.datasets.value.length;
    }
  },
  deselected(args: any) {
    v.selectedRowIndex.value = -1;
    v.buttons.edit.value = false;
    v.buttons.cancel.value = false;
    v.dataset.value = {};
    v.splitter.value = 100;
    //gridReference.value.refresh();
  }
};
const _ = {};

export function useListContainer(form?: string) {
  onMounted(async () => {
    if (form !== undefined) {
      console.log('form', form);
      v.form = form;
      v.currentForm = cForms.forms[form];
      await m.loadDatasets();
    }
  });


  return {
    v, m, on
  };
}
