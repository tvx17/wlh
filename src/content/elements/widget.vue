<template>
  <q-card :style="widgetDisplaySize" :flat="props.flat">
    <q-card-section>
      <widget-header
        :dense="props.dense"
        :icon="props.icon"
        :label="props.label"
        :button-add="buttons.add"
        :button-to-list-view="buttons.toListView"
        :button-side-by-side="buttons.sideBySide"
        :button-delete="buttons.delete"
        :button-enlarge="buttons.enlarge"
        :button-reduce="buttons.reduce"
        :button-refresh="buttons.refresh"
        :button-list-view="buttons.listView"
        @on:click="onButtonPressed"
      />
    </q-card-section>
    <q-separator />
    <q-card-section>
      <!-- List only -->
      <template v-if="props.mode === 'list'">
        <widget-list
          :datatable="props.datatable"
          :edit-button="false"
          :delete-button="false"
          @on:select="onSelect"
          @done:refresh-data="refreshData = false"
          :refresh-data="refreshData"
          :dense="props.dense"
          :current-row="currentRow"
        />
      </template>
      <!-- Editor only -->
      <template v-if="props.mode === 'edit'">
        <!--      <widget-edit />-->
      </template>
      <template v-if="props.mode === 'both'">
        <template v-if="props.useSplitter">
          <q-splitter v-model="splitterValue">
            <template #before v-if="currentId !== -1">
              <widget-list
                :datatable="props.datatable"
                :edit-button="true"
                :delete-button="true"
                @on:edit="onEdit"
                @on:delete="onDelete"
                @done:refresh-data="refreshData = false"
                :refresh-data="refreshData"
                :dense="props.dense"
                :current-row="currentRow"
              />
            </template>
            <template #after>
              <div v-if="!currentId" class="q-pa-xl text-h4">
                Bitte links einen Eintrag wählen
              </div>
              <div v-if="currentId">
                <widget-edit
                  :datatable="props.datatable"
                  :id="currentId"
                  @done:save="onSaved"
                />
              </div>
            </template>
          </q-splitter>
        </template>
        <template v-if="!props.useSplitter">
          <div v-if="localMode === 'list'">
            <widget-list
              :datatable="props.datatable"
              :edit-button="true"
              :delete-button="true"
              @on:edit="onEdit"
              @on:delete="onDelete"
              @done:refresh-data="refreshData = false"
              :refresh-data="refreshData"
              :dense="props.dense"
              :current-row="currentRow"
            />
          </div>
          <div v-if="localMode === 'edit' && currentId">
            <widget-edit
              :datatable="props.datatable"
              :id="currentId"
              @done:save="onSaved"
            />
          </div>
        </template>
      </template>
    </q-card-section>

    <!-- Both -->
  </q-card>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';

// -------------------------------------------------------------- Components
const widgetHeader = defineAsyncComponent({
  loader: () => import('src/content/elements/widgetHeader.vue'),
});
const widgetList = defineAsyncComponent({
  loader: () => import('src/content/elements/widgetList.vue'),
});
const widgetEdit = defineAsyncComponent({
  loader: () => import('src/content/elements/widgetEdit.vue'),
});

// -------------------------------------------------------------- Props
const props = defineProps({
  mode: {
    type: String,
    default: 'both',
  },
  size: {
    type: String,
    required: false,
    default: 'dynamic', // full, half, quarter, dynamic
  },
  id: {
    type: Number,
    required: false,
  },
  icon: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: null,
  },
  datatable: {
    type: String,
    required: true,
    default: null,
  },
  useSplitter: {
    type: Boolean,
    default: false,
  },
  flat: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: false,
  },
});

// -------------------------------------------------------------- Emits
const emit = defineEmits([]);

// -------------------------------------------------------------- Watch

// -------------------------------------------------------------- Computed
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

// -------------------------------------------------------------- Variables
const splitterValue = ref(25);
const localMode = ref('list');
const currentId = ref();
const currentRow = ref();
const refreshData = ref(false);
const widgetSize = ref(props.size);
const buttons = ref({
  add: true,
  toListView: true,
  delete: true,
  enlarge: true,
  reduce: true,
  listView: true,
  sideBySide: true,
  refresh: true,
});

// -------------------------------------------------------------- Methods
const onEdit = (data) => {
  console.log('edit');
  console.log(data);
  if (!props.useSplitter) {
    localMode.value = 'edit';
  }
  currentId.value = data.id;
  currentRow.value = data.index;
};
const onDelete = (data) => {
  console.log('delete');
  console.log(data);
};
const onSelect = (data) => {
  console.log('select');
  console.log(data);
};
const onSaved = () => {
  if (!props.useSplitter) {
    localMode.value = 'list';
  }
  refreshData.value = true;
};

const onButtonPressed = (buttonName: string) => {
  console.log('button pressed', buttonName);
  switch (buttonName) {
    case 'add':
      onEdit({ id: -1, index: null });
      setButtons('new')
      splitterValue.value = 0;
      break;
    case 'toListView':
      setButtons('both');
      if(currentId.value === -1){
          splitterValue.value = 25;
          currentId.value = null;
      }
  }
};

const setButtons = (mode: string) => {
  switch (mode) {
    case 'list':
      buttons.value.add = false;
      buttons.value.toListView = false;
      buttons.value.delete = false;
      buttons.value.enlarge = true;
      buttons.value.reduce = false;
      buttons.value.listView = false;
      buttons.value.sideBySide = false;
      buttons.value.refresh = true;
      break;
    case 'edit':
      break;
    case 'both':
      buttons.value.add = true;
      buttons.value.toListView = false;
      buttons.value.delete = false;
      buttons.value.enlarge = false;
      buttons.value.reduce = false;
      buttons.value.listView = false;
      buttons.value.sideBySide = false;
      buttons.value.refresh = true;
      break;
    case 'new':
      buttons.value.add = false;
      buttons.value.toListView = true;
      buttons.value.delete = false;
      buttons.value.enlarge = false;
      buttons.value.reduce = false;
      buttons.value.listView = false;
      buttons.value.sideBySide = false;
      buttons.value.refresh = false;
      break
  }
};

// -------------------------------------------------------------- Lifecycle
onMounted(() => {
  setButtons(props.mode);
});
</script>
