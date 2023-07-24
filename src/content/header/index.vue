<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        disable
        icon="fa-solid fa-home"
        :class="contents.mode === 'home' ? 'bg-light-blue-4' :''"
        flat
        dense
        @click="contents.mode = 'home'"
      />
      <q-space />
      <q-btn
        disable
        icon="fa-solid fa-list"
        :class="contents.mode === 'contents' ? 'bg-light-blue-4' : ''"
        flat
        dense
        @click="contents.mode = 'contents'"
      />
      <q-space />
      <q-btn
        icon="fa-solid fa-feather"
        :class="contents.mode === 'write' ? 'bg-light-blue-4' : ''"
        flat
        dense
        @click="contents.mode = 'write'"
      />
      <q-space />
      <q-btn
        icon="fa-solid fa-sliders"
        disable
        :class="contents.mode === 'settings' ? 'bg-light-blue-4' : ''"
        flat
        dense
        @click="contents.mode = 'settings'"
      />
    </q-toolbar>
  </q-header>
</template>
<script setup lang="ts">
import { contents } from 'src/app/store';
</script>
