<template>
  <q-card :style="widgetDisplaySize">
    <q-card-section>
      <q-bar class="bg-white">
        <span v-if="props.icon" style="padding-right: 1em"
          ><q-icon :name="props.icon"
        /></span>
        <span>{{ props.label }}</span>
        <q-space />
        <q-btn-group flat>
          <q-btn icon="fa-solid fa-plus" dense flat round @click="onNew">
            <q-tooltip>{{$t('widget.addDataset')}}</q-tooltip>
          </q-btn>

          <q-btn
            icon="fa-solid fa-reply"
            dense
            flat
            round
            @click="showEditArea = false"
            v-if="!widgetUseSplitter && showEditArea"
          >
            <q-tooltip>Zur Listenansicht</q-tooltip>
          </q-btn>
          <q-btn
            icon="fa-solid fa-trash"
            dense
            flat
            round
            @click="onDelete"
            v-if="
              (currentSelectedDatasetId && currentSelectedDatasetId !== -1) ||
              showEditArea ||
              widgetMode === 'form' ||
              (widgetMode === 'both' &&
                widgetUseSplitter &&
                currentSelectedDatasetId)
            "
          >
            <q-tooltip>Datensatz löschen</q-tooltip>
          </q-btn>
          <q-btn
            icon="fa-solid fa-expand"
            dense
            flat
            round
            @click="widgetSize = 'full'"
            v-if="
              props.size !== 'full' &&
              props.allowSizeChange &&
              widgetSize !== 'full'
            "
          >
            <q-tooltip>Vergrößern</q-tooltip>
          </q-btn>
          <q-btn
            v-if="
              props.size === 'full' &&
              props.allowSizeChange &&
              widgetSize === 'full'
            "
            icon="fa-solid fa-compress"
            dense
            flat
            round
          >
            <q-tooltip>Verkleinern</q-tooltip>
          </q-btn>
          <q-btn
            icon="fa-solid fa-bars"
            v-if="widgetUseSplitter && widgetMode === 'both'"
          >
            <q-tooltip>Wie soll ich es nennen</q-tooltip>
          </q-btn>
          <q-btn
            icon="fa-solid fa-table-columns"
            dense
            flat
            round
            v-if="
              widgetMode === 'both' && !widgetUseSplitter && props.allowSplitter
            "
          >
            <q-tooltip>Nebeneinanderansicht</q-tooltip>
          </q-btn>
          <q-btn
            icon="fa-solid fa-rotate"
            v-if="
              (widgetMode === 'both' && !showEditArea) ||
              widgetMode === 'list' ||
              (widgetMode === 'both' && widgetUseSplitter)
            "
            @click="shouldUpdate = true"
          >
            <q-tooltip>Liste auffrischen</q-tooltip>
          </q-btn>
        </q-btn-group>
      </q-bar>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <!-- NON splitter mode -->
      <template v-if="widgetMode === 'both'">
        <template v-if="widgetUseSplitter">
          <q-splitter v-model="splitterSize">
            <template v-slot:before>
              <element-list
                :datatable="props.datatable"
                @on:select="emit('on:select', $event)"
                @on:edit="onEdit"
                :update="shouldUpdate"
                @done:update="onUpdated"
              />
            </template>
            <template v-slot:after>
              <component
                :is="currentComponent"
                :id="currentSelectedDatasetId"
                :index="currentSelectedDatasetIndex"
                :datatable="props.datatable"
                @on-save="onSaved"
              />
            </template>
          </q-splitter>
        </template>
        <template v-if="!widgetUseSplitter">
          <div v-show="!showEditArea">
            Nichts da
            <element-list
              mode="fjjf"
              :datatable="props.datatable"
              @on:select="emit('on:select', $event)"
              @on:edit="onEdit"
              :update="shouldUpdate"
              @done:update="onUpdated"
            />
          </div>
          <div v-show="showEditArea">
            <component
              :is="currentComponent"
              :id="currentSelectedDatasetId"
              :index="currentSelectedDatasetIndex"
              :datatable="props.datatable"
              @on-save="onSaved"
            />
          </div>
        </template>
      </template>
      <template v-if="widgetMode === 'form'">
        <div>
          <component
            :is="currentComponent"
            :id="currentSelectedDatasetId"
            :index="currentSelectedDatasetIndex"
            :datatable="props.datatable"
            @on-save="onSaved"
          />
        </div>
      </template>
      <template v-if="widgetMode === 'list'">
        <element-list
          @on:select="emit('on:select', $event)"
          :datatable="props.datatable"
          @on:edit="onEdit"
          :update="shouldUpdate"
          @done:update="onUpdated"
        />
      </template>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { dialogs } from 'src/tvx/helper/messages';

interface iOnEdit {
  id: number;
  index: number;
}

import {
  computed,
  defineAsyncComponent,
  onMounted,
  ref,
  shallowRef,
} from 'vue';
import lang from "src/app/lang";

const formUsers = defineAsyncComponent({
  loader: () => import('src/content/forms/users.vue'),
});
const formBooks = defineAsyncComponent({
  loader: () => import('src/content/forms/books.vue'),
});
const elementList = defineAsyncComponent({
  loader: () => import('src/content/elements/list.vue'),
});

const props = defineProps({
  icon: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: true,
  },
  datatable: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: false,
  },
  mode: {
    type: String,
    required: false,
    default: 'both', //list, form, both
  },
  useSplitter: {
    type: Boolean,
    required: false,
    default: false,
  },
  size: {
    type: String,
    required: false,
    default: 'dynamic', // full, half, quarter, dynamic
  },
  allowSplitter: {
    type: Boolean,
    required: false,
    default: false,
  },
  allowSizeChange: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(['on:edit', 'on:select']);

const widgetMode = ref(props.mode);
const widgetUseSplitter = ref(props.useSplitter);
const widgetSize = ref(props.size);

const currentComponent = shallowRef();
const splitterSize = ref(50);
const currentSelectedDatasetId = ref();
const currentSelectedDatasetIndex = ref();
const showEditArea = ref(false);
const shouldUpdate = ref(false);

const widgetDisplaySize = computed(() => {
  switch (widgetSize.value) {
    case 'full':
      return 'width: 100%;';
    case 'half':
      return 'width: 50%';
    case 'quarter':
      return 'width: 25%';
  }
  return '';
});

const onSaved = () => {
  shouldUpdate.value = true;
};

const onUpdated = () => {
  shouldUpdate.value = false;
};

const onDelete = () => {
  dialogs
    .deleteAsync(
      'Datensatz löschen',
      'Möchtest Du diesen Datensatz wirklich löschen'
    )
    .then((r) => {
      console.log('Na dann', currentSelectedDatasetId.value);
    });
};

const onNew = () => {
  currentSelectedDatasetId.value = -1;
  currentSelectedDatasetIndex.value = -1;
  if (props.mode === 'both' || props.mode === 'list') {
    showEditArea.value = true;
  }
};

const onEdit = (data: iOnEdit) => {
  console.log('Onni')
  if (widgetMode.value !== 'list') {
    currentSelectedDatasetId.value = data.id;
    currentSelectedDatasetIndex.value = data.index;
  }
  if (widgetUseSplitter.value && widgetMode.value === 'both') {
    switch (props.size) {
      case 'full':
        splitterSize.value = 25;
        break;
      case 'half':
        splitterSize.value = 50;
        break;
      case 'quarter':
        splitterSize.value = 75;
        break;
      case 'dynamic':
        splitterSize.value = 100;
        break;
    }
  }
  if (!widgetUseSplitter.value && widgetMode.value === 'both') {
    showEditArea.value = true;
  }
  emit('on:edit', {
    id: currentSelectedDatasetId.value,
    index: currentSelectedDatasetIndex.value,
  });
};

const setComponent = (newComponent: string) => {
  switch (newComponent) {
    case 'users':
      currentComponent.value = formUsers;
      break;
    case 'books':
      currentComponent.value = formBooks;
      break;
  }
};

onMounted(() => {
  lang.loadData('elements', 'widget');
  setComponent(props.datatable);
  if (widgetUseSplitter.value) {
    splitterSize.value = 100;
  }
});
</script>
