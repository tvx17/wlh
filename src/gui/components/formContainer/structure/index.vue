<template>
  Not yet implemented
</template>

<script lang="ts" setup>
// -------------------------- Forms
// ================================
import settings from 'src/gui/forms/settings.vue';


// -------------------------- Vue & Quasar-Imports
// ======================================
import { onMounted, provide, ref, watch } from 'vue';


// -------------------------- Props
// ================================
const props = defineProps(
  {
    form: {
      type: String,
      required: true,
      default: ''
    },
  });



</script>
<style>
@import '../../../../../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../../../../../node_modules/@syncfusion/ej2-vue-layouts/styles/material.css';
</style>
