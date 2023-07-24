<template>
  <div v-if="props.id === -1" class="text-h5 q-pa-xs">Neu</div>
  <component
    v-if="currentComponent"
    :is="currentComponent"
    :id="props.id"
    :datatable="props.datatable"
    @done:save="$emit('done:save')"
  />
</template>

<script setup lang="ts">
// -------------------------------------------------------------- Components
const formUsers = defineAsyncComponent({
  loader: () => import('src/content/forms/users.vue'),
});
// -------------------------------------------------------------- Props
import { defineAsyncComponent, onMounted, ref } from "vue";

const props = defineProps({
  datatable: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  }
})


// -------------------------------------------------------------- Emits
const emit = defineEmits(['done:save'])

// -------------------------------------------------------------- Variables
const currentComponent = ref();

// -------------------------------------------------------------- Watch

// -------------------------------------------------------------- Methods
const setComponent = ()=>{
  switch(props.datatable){
    case 'users':
      currentComponent.value = formUsers
      break
  }
}

// -------------------------------------------------------------- Lifecycle
onMounted(() => {
  setComponent()
})
</script>
