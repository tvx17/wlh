<!-- -->
<template>
  <br/>
  <q-separator/>
  <at :label="props.createdAtLabel" :dt-string="props.createdAt" :class="'text-grey-' + greyShade"/>
  <at :label="props.updatedAtLabel" :dt-string="props.updatedAt" :class="'text-grey-' + greyShade"/>
</template>

<script setup>
import at from 'src/gui/elements/at.vue';

const greyShade = '4';

const props = defineProps(
  {
    createdAt: {required: true, type:String, default: ''},
    updatedAt: {required: true, type:String, default: ''},
    createdAtLabel: {type:String, default: 'Created at', required: false},
    updatedAtLabel: {type:String, default: 'Updated at', required: false},
  }
);

</script>
