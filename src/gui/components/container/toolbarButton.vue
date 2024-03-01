<script lang="ts" setup>

const props = defineProps(
  {
    button: {
      type: String,
      required: true,
      default: '',
    },
    available: {
      type: Boolean,
      required: true,
      default: false,
    },
  });

const emit = defineEmits(['on:click']);

const icon = {
  add: 'fa-solid fa-plus',
  edit: 'fa-solid fa-edit',
  delete: 'fa-solid fa-trash',
  cancel: 'fa-solid fa-ban',
};

</script>

<template lang="pug">
  q-btn(
    :icon="icon[props.button]"
    flat
    dense
    @click="emit('on:click')"
    size="sm"
    :class="['full-width', !props.available ? 'text-grey-4': '']"
    :disable="!props.available")
</template>

<style scoped>

</style>
