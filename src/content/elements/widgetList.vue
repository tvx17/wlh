<template>
  <div v-if="dataRows.length === 0">
    {{ $t('list.noDatasets') }}
  </div>
  <div v-if="dataRows.length > 0">
    <q-list class="q-pa-md" separator :dense="props.dense">
      <q-item
        :class="dataRowIndex === props.currentRow ? 'bg-light-blue-3':''"
        v-for="(dataRow, dataRowIndex) in dataRows"
        :key="dataRowIndex"
        @click="
          !props.editButton && !props.deleteButton
            ? $emit('on:select', { id: dataRow.id, index: dataRowIndex })
            : null
        "
        :clickable="!props.editButton || !props.deleteButton"
      >
        <q-item-section
          avatar
          flat
          v-if="props.editButton || props.deleteButton"
        >
          <q-btn-group flat dense>
            <q-btn
              v-if="props.deleteButton"
              icon="fa-solid fa-trash"
              dense
              size="sm"
              flat
              @click="onDelete(dataRowIndex)"
            />
            <q-btn
              v-if="props.editButton"
              icon="fa-solid fa-pen"
              dense
              size="sm"
              flat
              @click="$emit('on:edit', { id: dataRow.id, index: dataRowIndex })"
            />
          </q-btn-group>
        </q-item-section>
        <q-item-section>
          {{ dataRow.summary }}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import crud, { crudModes } from 'src/tvx/helper/crud';
import { dialogs } from 'src/tvx/helper/messages';
import { useI18n } from 'vue-i18n';

import lang from 'src/app/lang';
import { data } from 'autoprefixer';

// -------------------------------------------------------------- Components

// -------------------------------------------------------------- Props
const props = defineProps({
  datatable: {
    type: String,
    required: true,
  },
  editButton: {
    type: Boolean,
    default: false,
  },
  deleteButton: {
    type: Boolean,
    default: false,
  },
  refreshData: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  currentRow: {
    type: Number,
    required: true
  },
});
// -------------------------------------------------------------- Emits
const emit = defineEmits([
  'on:edit',
  'on:delete',
  'on:select',
  'done:refreshData',
]);

// -------------------------------------------------------------- Constants
const { t } = useI18n();

// -------------------------------------------------------------- Variables
const dataRows = ref([]);

// -------------------------------------------------------------- Watch
watch(
  () => props.refreshData,
  async (newValue) => {
    if (newValue) {
      await loadData();
      emit('done:refreshData');
    }
  }
);

// -------------------------------------------------------------- Methods
const onDelete = (index: number) => {
  dialogs
    .deleteAsync(t('list.deleteDataset'), t('list.deleteDatasetMessage'))
    .then((r) => {
      if (r) {
        emit('on:delete', { id: dataRows.value[index], index: index });
        console.log(index);
        console.log('Bye');
      }
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
      if (dataRows.value.length > 0) {
        emit('on:edit', { id: dataRows.value[0].id, index: 0 });
      }
    });
};

// -------------------------------------------------------------- Lifecycle
onMounted(async () => {
  /*await lang.loadData('components/elements', 'list');*/
  await loadData();
});
</script>
