<template>
  <sf-grid ref="gridReference"
           :allowEditing="true"
           :dataSource="variables.datasets.value"
           :selectedRowIndex="variables.selectedRowIndex"
           @row-selected="on.selected"
           @row-deselected="on.deselected"
  >
    <sf-columns>
      <sf-column field="summary"
                 headerText="Summary"
                 textAlign="left"></sf-column>
    </sf-columns>
  </sf-grid>
</template>

<script lang="ts" setup>
import {
  ColumnDirective as sfColumn,
  ColumnsDirective as sfColumns,
  GridComponent as sfGrid
} from '@syncfusion/ej2-vue-grids';
import { on } from 'src/gui/components/formContainer/list/methods';

import { variables } from 'src/gui/components/formContainer/list/variables';

import { onMounted, ref, watch } from 'vue';


const props = defineProps(
  {
    hasChanged: {
      type: Boolean,
      required: true,
      default: false
    }
  });
const emits = defineEmits(['update:hasChanged']);

watch(() => props.hasChanged, (newValue) => {
  if (newValue) {
    gridReference.value.refresh();
    emits('update:hasChanged', false);
  }
});

const gridReference = ref();


onMounted(() => {
//---
});

</script>

<style>
@import "../../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "../../../../node_modules/@syncfusion/ej2-calendars/styles/material.css";
@import "../../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
@import "../../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
@import "../../../../node_modules/@syncfusion/ej2-popups/styles/material.css";
@import "../../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
@import "../../../../node_modules/@syncfusion/ej2-vue-grids/styles/material.css";
</style>
