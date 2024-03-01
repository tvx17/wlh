<script lang="ts" setup>
import { columnWidths } from 'src/app/constants/app';
import { computed } from 'vue';

const props = defineProps(
  {
    modelValue: { required: true },
    label: { required: true, type: String },
    disable: { required: false, type: Boolean, default: false },
    placeholder: { required: false, type: String, default: 'Please enter a value' }
  }
);
const emits = defineEmits(['update:modelValue']);

const value = computed(
  {
    get: () => props.modelValue, set: (value) => {
      emits('update:modelValue', value);
    }
  });
</script>
<template lang="pug">
  div(class="text-overline")
    div(class="row")
      div(:class="'col-' + columnWidths.label")
        | {{ props.label }}
      div(:class="'col-' + columnWidths.field")
        q-input(v-model="value" :disable="props.disable" :placeholder="props.placeholder" dense )

</template>



