<template>
    <q-btn v-if="props.visible"
           :color="!props.available ? 'grey-3' : 'black'"
           :disable="!props.available"
           class="full-width"
           dense
           flat
           :icon="props.icon"
           size="sm"
           @click="emit('on:click')">
      <q-tooltip>Add a data item</q-tooltip>
    </q-btn>
</template>

<script lang="ts" setup>

const props = defineProps(
  {
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    available: {
      type: Boolean,
      required: true,
      default: false,
    },
    icon: {
      type: String,
      required: true,
      default: 'fa-solid fa-plus',
    },
  }
);

const emit = defineEmits(['on:click']);


</script>

<style scoped>

</style>
