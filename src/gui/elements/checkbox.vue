<!-- -->
<template>
  <div class="text-overline">
    <div class="row">
      <div :class="'col-' + columnWidths.label">
        {{ props.label }}
      </div>
      <div :class="'col-' + columnWidths.field">
        <sf-checkbox :disabled="props.disable" v-model="value" />
      </div>
    </div>
  </div>

</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {columnWidths} from 'src/app/constants/app';
import { CheckBoxComponent as sfCheckbox } from "@syncfusion/ej2-vue-buttons";

const props = defineProps(
  {
    modelValue: {required: true},
    label: {required: true, type: String},
    disable: {required: false, type: Boolean, default: false},
    placeholder: {required: false, type: String, default: 'Please enter a value'}
  }
);
const emits = defineEmits(['update:modelValue']);

const value = computed({
  get: () => props.modelValue, set: (value) => {
    emits('update:modelValue', value);
  }
});

</script>
<style>
@import '../../../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-buttons/styles/material.css';
</style>
