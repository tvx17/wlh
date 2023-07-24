<template>
  <div>
    <q-bar class="bg-white" :dense="props.dense">
      <span v-if="props.icon" style="padding-right: 1em"
        ><q-icon :name="props.icon"
      /></span>
      <span>{{ props.label }}</span>
      <q-space />
      <q-btn-group flat>
        <q-btn v-if="props.buttonAdd" icon="fa-solid fa-plus" dense flat round @click="$emit('on:click','add')">
          <q-tooltip>{{ $t('widget.addDataset') }}</q-tooltip>
        </q-btn>
        <q-btn v-if="props.buttonToListView" icon="fa-solid fa-reply" dense flat round @click="$emit('on:click','toListView')">
          <q-tooltip>Zur Listenansicht</q-tooltip>
        </q-btn>
        <q-btn v-if="props.buttonDelete" icon="fa-solid fa-trash" dense flat round @click="$emit('on:click','delete')">
          <q-tooltip>Datensatz löschen</q-tooltip>
        </q-btn>
        <q-btn v-if="props.buttonEnlarge" icon="fa-solid fa-expand" dense flat round @click="$emit('on:click','enlarge')">
          <q-tooltip>Vergrößern</q-tooltip>
        </q-btn>
        <q-btn v-if="props.buttonReduce" icon="fa-solid fa-compress" dense flat round @click="$emit('on:click','reduce')">
          <q-tooltip>Verkleinern</q-tooltip>
        </q-btn>
        <q-btn v-if="buttonListView" icon="fa-solid fa-bars" dense flat round @click="$emit('on:click','listView')">
          <q-tooltip>Listenansicht</q-tooltip>
        </q-btn>
        <q-btn v-if="props.buttonSideBySide" icon="fa-solid fa-table-columns" dense flat round @click="$emit('on:click','sideBySide')">
          <q-tooltip>Nebeneinanderansicht</q-tooltip>
        </q-btn>
        <q-btn v-if="props.buttonRefresh" icon="fa-solid fa-rotate" dense flat round @click="$emit('on:click','refresh')">
          <q-tooltip>Liste auffrischen</q-tooltip>
        </q-btn>
      </q-btn-group>
    </q-bar>
  </div>
</template>

<script setup lang="ts">
// -------------------------------------------------------------- Components

// -------------------------------------------------------------- Props
const props = defineProps({
  icon: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: null,
  },
  buttonAdd: {
    type: Boolean,
    default: false,
  },
  buttonToListView:{
    type: Boolean,
    default: false,
  },
  buttonDelete: {
    type: Boolean,
    default: false,
  },
  buttonEnlarge: {
    type: Boolean,
    default: false,
  },
  buttonReduce: {
    type: Boolean,
    default: false,
  },
  buttonListView: {
    type: Boolean,
    default: false,
  },
  buttonSideBySide: {
    type: Boolean,
    default: false,
  },
  buttonRefresh: {
    type: Boolean,
    default: false,
  },
  dense:{
    type: Boolean,
    default: false,
  }
});
// -------------------------------------------------------------- Emits
const emit = defineEmits(['on:click']);
// -------------------------------------------------------------- Variables

// -------------------------------------------------------------- Methods

// -------------------------------------------------------------- Watch

// -------------------------------------------------------------- Lifecycle
</script>
