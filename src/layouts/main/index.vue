<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <toolbar/>
    </q-header>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import Toolbar from "layouts/main/components/toolbar.vue";
</script>
