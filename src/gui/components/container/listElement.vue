<script lang="ts" setup>
import {
  ColumnDirective as sfColumn,
  ColumnsDirective as sfColumns,
  GridComponent as sfGrid
} from '@syncfusion/ej2-vue-grids';
import { useListContainer } from 'src/gui/components/container/list';
import { onMounted } from 'vue';

const { v, m, on } = useListContainer();

onMounted(() => {
//---
});

</script>

<template lang="pug">
  sf-grid(
    ref="gridReference"
    :allowEditing="true"
    :dataSource="v.datasets.value"
    :selectedRowIndex="v.selectedRowIndex.value"
    @row-selected="on.selected"
    @row-deselected="on.deselected")
    sf-columns
      sf-column(field="summary" headerText="Summary" textAlign="left")
</template>

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
