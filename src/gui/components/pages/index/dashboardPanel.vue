<script setup lang="ts">
// -------------------------- Component-Imports
// ============================================
import {
  PanelDirective as sfDashboardPanel,
} from '@syncfusion/ej2-vue-layouts';

import { forms } from 'src/app/constants/forms';
import { inject, onMounted, ref } from 'vue';

// -------------------------- App-Imports
// ======================================
import { useApp } from 'src/app/useApp';
import { useEntities } from 'src/app/useEntities';

const { logging } = useApp();
const { settings } = useEntities();

const inEditMode = inject('inEditMode');
const panels = inject('panels');

onMounted(() => {

});
</script>

<template>
<sf-dashboard-panel
            v-for="(panel, panelIndex) in panels"
            :id="panel.id"
            :key="panelIndex"
            :col="panel.col"
            :row="panel.row"
            :sizeX="panel.sizeX"
            :sizeY="panel.sizeY"
            content="content">
            <template v-slot:content>
                <q-bar class="e-panel-header">
                  {{ forms[panel.form]['header'] }}
                  <q-space />
                  <q-btn v-if="inEditMode"
                         flat icon="fas fa-times">
<!--                         @click="removePanel(panelIndex)">-->
                    <q-tooltip>Remove</q-tooltip>
                  </q-btn>
                </q-bar>
                <div v-if="inEditMode" class="q-pa-md">
                  <div class="text-h6">
                    Choose the component to display here:
                  </div>
                  <div class="q-pa-md row items-start q-gutter-md">
                    <q-card v-for="form in availableForms" :key="form">
                      <q-card-section
                        :class="[form.value === panel.form ? 'bg-grey-3 text-black text-h6 disabled' : 'text-h6', form.highlighted ? 'bg-green-3 cursor-pointer' : '']"
                        @mouseenter="form.value !== panel.form ? form.highlighted = true : form.highlighted = false"
                        @mouseleave="form.highlighted = false">
                        {{ form.label }}
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
                <div v-if="!inEditMode">
                  <form-container-list :form="panel.form" v-if="forms[panel.form]['type'] === 'list'"/>
                  <form-container-single :form="panel.form" v-if="forms[panel.form]['type'] === 'single'"/>
<!--                  <structure-form-formContainer :form="panel.form" v-if="forms[panel.form]['type'] === 'structure'"/>-->
                </div>
              </template>
          </sf-dashboard-panel>
</template>



<style>
@import "../../../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../../../node_modules/@syncfusion/ej2-vue-layouts/styles/material.css";
</style>
