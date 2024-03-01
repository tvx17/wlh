<script lang="ts" setup>
import {ref} from 'vue';

const structureWidth = ref(3);
</script>

<template lang="pug">
  q-page
    | {{structureWidth}}
    div(class="row q-pa-xs")
      div(:class="'col-'+structureWidth" style="border: 1px solid #000000")
        div
          q-btn-group
            q-btn(label="+" @click="structureWidth++")
            q-btn(label="-" @click="structureWidth--")
        div
          | Kapitel
</template>

<style>

</style>
