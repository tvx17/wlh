<template>
  <q-btn-group class="full-width">
    <q-btn
      v-for="(widget, widgetIndex) in props.buttons"
      :key="widgetIndex"
      :icon="widget.icon"
      dense
      :text-color="widget.isVisible ? 'white' : 'black'"
      :color="widget.isVisible ? 'primary' : 'white'"
      @click="emits('on:widgetVisibilityChange', widgetIndex)"
      class="full-width"
    />
  </q-btn-group>
</template>
<script setup lang="ts">
const props = defineProps({
  buttons: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(['on:widgetVisibilityChange']);

</script>
