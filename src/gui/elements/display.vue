<script lang="ts" setup>
import { columnWidths } from 'src/app/constants/app';

const props = defineProps(
  {
    displayValue: { required: true },
    label: { required: true, type: String }
  }
);
</script>
<template lang="pug">
  div(class="text-overline")
    div(class="row")
      div(:class="'col-' + columnWidths.label")
        | {{ props.label }}
      div(:class="'col-' + columnWidths.field")
        | {{ props.displayValue }}

</template>


