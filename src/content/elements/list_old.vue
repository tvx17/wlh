<template>
  <div v-if="dataRows.length === 0">
    {{$t('list.noDatasets')}}
  </div>
  <div v-if="dataRows.length > 0">
    {{props.mode}}
    <q-list class="q-pa-md" separator dense>
      <q-item
        :clickable="props.mode === 'list'"
        @click="props.mode === 'list' ? emit('on:select', { id: dataRow.id, index: dataRowIndex }) : null"
        v-for="(dataRow, dataRowIndex) in dataRows"
        :key="dataRowIndex"
        :class="
          props.selectionHighlight && props.selectedIndex === dataRowIndex
            ? 'bg-primary text-white'
            : ''
        "
      >
        <q-item-section avatar flat v-if="props.mode !== 'list'">
          <q-btn-group>
            <q-btn
              icon="fa-solid fa-trash"
              dense
              size="sm"
              flat
              @click="onDelete(dataRowIndex)"
            />
            <q-btn
              icon="fa-solid fa-pen"
              dense
              size="sm"
              flat
              @click="emit('on:edit', { id: dataRow.id, index: dataRowIndex })"
            />
          </q-btn-group>
        </q-item-section>
        <q-item-section>{{ dataRow.summary }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import crud, { crudModes } from 'src/tvx/helper/crud';
import { dialogs } from 'src/tvx/helper/messages';
import {useI18n} from "vue-i18n";

import lang from "src/app/lang";

const { t } = useI18n();

const props = defineProps({
  datatable: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    required: false,
    default: 'list',
  },
  selectedIndex: {
    type: Number,
    required: false,
  },
  selectionHighlight: {
    type: Boolean,
    required: false,
    default: false,
  },
  update:{
    type: Boolean,
    required: false,
    default: false
  }
});

const emit = defineEmits(['on:edit','done:update','on:select']);

const dataRows = ref([]);

watch(()=>props.update, async (newValue) => {
  if(newValue){
    await loadData();
    emit('done:update');
  }
});


const onDelete = (index: number) => {
  dialogs
    .deleteAsync(
      t('list.deleteDataset'),t('list.deleteDatasetMessage')
    )
    .then((r) => {
      console.log('Bye');
    });
};
const loadData = async () => {
  crud
    .readAll({
      destination: props.datatable,
      overrideCrudMode: crudModes.sequelize,
    })
    .then((r) => {
      dataRows.value = r ? r : [];
    });
};

onMounted(async () => {
  await lang.loadData('components/elements','list')
  await loadData();
});
</script>
