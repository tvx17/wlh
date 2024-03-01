<template>
  <settings v-if="forms[props.form].form === 'settings'"/>
</template>

<script lang="ts" setup>
import settings from 'src/gui/forms/settings.vue';
import {forms} from 'src/app/constants/forms';

// -------------------------- Props
// ================================
const props = defineProps(
  {
    form: {
      type: String,
      required: true,
      default: ''
    }
  });


</script>
<style>

</style>
