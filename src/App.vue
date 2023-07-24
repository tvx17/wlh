<template>
  <q-layout view="lHh Lpr lFf">
    <wlh-header />
    <q-page-container>
      <wlh-content />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import app from 'src/app/app';
import { crudMode, crudModes } from 'src/tvx/helper/crud';
import { currentProject } from 'src/app/store';
import { defineAsyncComponent, onMounted } from 'vue';
import { loadData } from 'src/app/lang';

const wlhHeader = defineAsyncComponent({
  loader: () => import('src/content/header/index.vue'),
});
const wlhContent = defineAsyncComponent({
  loader: () => import('src/content/index.vue'),
});

onMounted(() => {
  crudMode.value = crudModes.sequelize;
  app.setupCheck();
  app.init()
});
</script>
