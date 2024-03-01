<template>
  <q-btn v-if="props.display"
         :disable="props.disable"
         :icon="icon"
         dense
         flat
         round
         @click="emit('onClick')">
    <q-tooltip>{{ props.tooltip }}</q-tooltip>
  </q-btn>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const props = defineProps(
  {
    disable: {
      type: Boolean,
      required: false,
      default: false
    },
    type: {
      type: String,
      required: true,
      default: ''
    },
    tooltip: {
      type: String,
      required: false,
      default: 'Not implemented yet'
    },
    display: {
      type: Boolean,
      required: false
    }
  });

const emit = defineEmits(['onClick']);

const icon = ref('');

onMounted(() => {
  switch (props.type) {
    case 'components':
      icon.value = 'fas fa-eye';
      break;
    case 'edit':
      icon.value = 'fa-solid fa-pencil';
      break;
    case 'save':
      icon.value = 'fa-solid fa-save';
      break;
    case 'add':
      icon.value = 'fa-solid fa-plus';
      break;
    case 'back':
      icon.value = 'fa-solid fa-arrow-up-from-bracket';
      break;
    case 'search':
      icon.value = 'fas fa-search';
      break;
    case 'messages':
      icon.value = 'fas fa-bell';
      break;
  }
  console.log('viewEditButton', props);
});


</script>

<style scoped>

</style>
