// -------------------------- Constants-Imports
// ============================================
import { IForm } from 'src/app/constants/forms';

import { ref } from 'vue';

export const datasets = ref([]);
export const dataset = ref({});
export const selectedRowIndex = ref(-1);

export const splitter = ref(100);
export const buttons = {
  add: ref(true),
  cancel: ref(false),
  delete: ref(false),
  edit: ref(false),
  save: ref(false)
};
export const hasChanged = ref(false);

export const unchangedDataset = {};

export const strings = {
  addTitle: 'Add',
  addMessage: 'Add new item',
  deleteTitle: 'Delete',
  deleteMessage: 'Are you sure you want to delete this item?'
};

export const currentForm: IForm = {
  minDatasets: 0,
  form: '',
  header: '',
  type: '',
  table: ''
};

export const variables = {
  currentForm,
  datasets,
  dataset,
  selectedRowIndex,
  splitter,
  buttons,
  hasChanged,
  unchangedDataset,
  strings
};

export default {
  currentForm,
  datasets,
  dataset,
  selectedRowIndex,
  splitter,
  buttons,
  hasChanged,
  unchangedDataset,
  strings
};
