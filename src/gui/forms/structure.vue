<template>
  Hallo
<!--  <div class="q-pa-md">
    <e-splitter-formContainer id='default-splitter'>
      <e-splitter-panes>
        <e-splitter-pane :size="variables.splitter.value + '%'" content='leftPane'>
          <template v-slot:leftPane>
            <form-structure-tree/>
          </template>
        </e-splitter-pane>
        <e-splitter-pane content='rightPane'>
          <template v-slot:rightPane>
            {{variables.currentForm.value}}
            <form-book v-if="variables.currentForm.value === 'books'"/>
            <form-chapters v-if="variables.currentForm.value === 'chapter'"/>
            <form-texts v-if="variables.currentForm.value === 'text'"/>
          </template>
        </e-splitter-pane>
      </e-splitter-panes>
    </e-splitter-formContainer>


  </div>-->
</template>

<script lang="ts" setup>
/*import {
  PaneDirective as eSplitterPane,
  PanesDirective as eSplitterPanes,
  SplitterComponent as eSplitterContainer,
} from '@syncfusion/ej2-vue-layouts';
import formBook from 'components/forms/_formBooks.vue';
import formChapters from 'components/forms/formChapters.vue';
import formTexts from 'components/forms/formTexts.vue';
import formStructureTree from 'components/misc/formStructureTree.vue';

import {useStructure} from 'src/app/appStructure';

const {variables} = useStructure();*/


</script>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-navigations/styles/material.css";
@import '../../../node_modules/@syncfusion/ej2-vue-layouts/styles/material.css';
</style>
