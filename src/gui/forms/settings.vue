<template>
  <div class="q-pa-md">
    <q-btn class="full-width" dense flat icon="fa-solid fa-save" size="sm" @click="onClick('save')" />
    <e-checkbox v-model="dataset.useUniverses"
                :disable="true"
                label="Use universes" />
    <e-checkbox v-model="dataset.useUniversesSections"
                :disable="true"
                label="Use universe sections" />
    <!--    <div class="row">
          <div class="col-2">
            Use universes
          </div>
          <div class="col-10">
            <sf-checkbox :disabled="true" />
          </div>
        </div>
        <div class="row">
          <div class="col-2">
            Use universe sections
          </div>
          <div class="col-10">
            <sf-checkbox :disabled="true" />
          </div>
        </div>-->
  </div>
</template>

<script lang="ts" setup>
import eCheckbox from 'src/gui/elements/checkbox.vue';
import { onMounted, ref } from 'vue';

const dataset = ref(
  {
    useUniverses: false,
    useUniversesSections: false
  });

function saveConfig(type: string, key: string) {
  // TODO
  console.log('saveConfig', type, key);
}

onMounted(() => {
  console.log('Load settings');
});
</script>
<style>
@import '../../../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-buttons/styles/material.css';
</style>
