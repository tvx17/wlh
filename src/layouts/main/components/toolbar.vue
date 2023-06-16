<template>
  <q-toolbar>
    {{currentProject}}
    <home/>
    <q-space/>
    <breadcrumbs/>
    <q-space/>
    <datatable-selection-button
      v-if="currentProject"
      @on:dataset-selected="onDatasetSelected"
      :id="currentProject.id"
      datatable="projects"
      button-site="left"
      tooltip="Anklicken, um weitere Projekte zu wählen"
      form="projects"
    />
  </q-toolbar>
</template>

<script setup>
import datatableSelectionButton from 'components/buttons/_old/buttonDataSelection/index.vue'
import Home from 'layouts/main/components/home.vue';
import Breadcrumbs from 'layouts/main/components/breadcrumbs.vue';
import {currentProject} from 'src/app/store';
import project from 'src/app/project'
import {onMounted} from 'vue';

const onDatasetSelected = async (id) => {
  alert('Dudu')
  await project.loadProject(id)
}

</script>
