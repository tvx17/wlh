<!-- -->
<template>
  <div class="text-overline">
    <div class="row">
      <div :class="'col-' + columnWidths.label">
        {{ props.label }}
      </div>
      <div :class="'col-' + columnWidths.field">

        {{new Date(props.dtString).toUTCString()}}
      </div>
    </div>
  </div>

</template>

<script setup>
import {columnWidths} from 'src/app/constants/app';

const props = defineProps(
  {
    dtString: {required: true, type:String, default: ''},
    label: {required: true, type: String},
  }
);


</script>
