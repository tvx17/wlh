<template>
  <q-btn-group class="full-width" flat>
    <q-btn v-if="props.add"
           :color="!props.addAvailable ? 'grey-3' : 'black'"
           :disable="!props.addAvailable"
           class="full-width"
           dense
           flat
           icon="fa-solid fa-plus"
           size="sm"
           @click="onClick('add')">
      <q-tooltip>Add a data item</q-tooltip>
    </q-btn>
    <q-btn v-if="props.edit"
           :color="!props.editAvailable ? 'grey-3' : 'black'"
           :disable="!props.editAvailable"
           class="full-width"
           dense
           flat
           icon="fa-solid fa-edit"
           size="sm"
           @click="onClick('edit')">
      <q-tooltip>Edit current item</q-tooltip>
    </q-btn>
    <q-btn v-if="props.save"
           :color="!props.saveAvailable ? 'grey-3' : 'black'"
           :disable="!props.saveAvailable"
           class="full-width"
           dense
           flat
           icon="fa-solid fa-save"
           size="sm"
           @click="onClick('save')">
      <q-tooltip>Save current item</q-tooltip>
    </q-btn>
    <q-btn v-if="props.delete"
           :color="!props.deleteAvailable ? 'grey-3' : 'black'"
           :disable="!props.deleteAvailable"
           class="full-width"
           dense
           flat
           icon="fa-solid fa-trash"
           size="sm"
           @click="onClick('delete')">
      <q-tooltip>Delete current item</q-tooltip>
    </q-btn>
    <q-btn v-if="props.cancel"
           :color="!props.cancelAvailable ? 'grey-3' : 'black'"
           :disable="!props.cancelAvailable"
           class="full-width"
           dense
           flat
           icon="fa-solid fa-times"
           size="sm"
           @click="onClick('cancel')">
      <q-tooltip>Close current item</q-tooltip>
    </q-btn>
  </q-btn-group>
</template>

<script lang="ts" setup>

const props = defineProps(
  {
    add: {
      type: Boolean,
      required: true,
      default: false,
    },
    addAvailable: {
      type: Boolean,
      required: true,
      default: false,
    },
    edit: {
      type: Boolean,
      required: true,
      default: false,
    },
    editAvailable: {
      type: Boolean,
      required: true,
      default: false,
    },
    save: {
      type: Boolean,
      required: false,
      default: false,
    },
    saveAvailable: {
      type: Boolean,
      required: false,
      default: false,
    },
    delete: {
      type: Boolean,
      required: true,
      default: false,
    },
    deleteAvailable: {
      type: Boolean,
      required: true,
      default: false,
    },
    cancel: {
      type: Boolean,
      required: true,
      default: false,
    },
    cancelAvailable: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
);

const emits = defineEmits(['add', 'edit', 'save', 'delete', 'cancel', 'click']);

function onClick(buttonName: string) {
  emits('click', buttonName);
}

</script>

<style scoped>

</style>
