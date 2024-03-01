<template>

        <q-toolbar-title>
          <span v-if="!props.inEditMode">WLH</span>
          <span v-if="props.inEditMode">Edit view</span>
        </q-toolbar-title>
</template>

<script lang="ts" setup>
const props = defineProps(
  {
    inEditMode: {
      type: Boolean,
      required: true,
      default: false
    }
  });
</script>
<style>
</style>
