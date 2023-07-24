<template>
  <q-page class="q-pa-xl" v-if="contents.type === 'testing'"></q-page>
  <q-page class="q-pa-xs" v-if="contents.type === 'index'">
    <div class="q-gutter-y-md">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="mails" label="Projekte" />
          <q-tab name="alarms" label="Alarms" />
          <q-tab name="movies" label="Movies" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="mails">
            <div class="text-h6">Mails</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <div class="text-h6">Alarms</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="movies">
            <div class="text-h6">Movies</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </q-card>

      <!--      <widget
              icon="fa-solid fa-user"
              label="Dutzner"
              datatable="users"
              mode="list"
              size="half"
              use-splitter
            />-->

      <!--      <div class="q-pt-md">
              <div class="row items-center justify-evenly">
                <span v-for="(widget, index) in widgets" :key="index">
                  <widget
                    v-if="widget.isVisible"
                    :icon="widget.icon"
                    :label="widget.label"
                    :datatable="widget.datatable"
                    mode="both"
                    allow-size-change
                  />
                </span>
              </div>
            </div>-->
    </div>
  </q-page>
  <q-page
    class="q-pa-xs"
    v-if="contents.type === 'editContent' && currentComponent"
  >
    <component :is="currentComponent" />
  </q-page>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { contents } from 'src/app/store';
import { lang } from 'src/app/lang';

const widgetButtons = defineAsyncComponent({
  loader: () => import('src/content/components/widgetButtons.vue'),
});
const widget = defineAsyncComponent({
  loader: () => import('src/content/elements/widget.vue'),
});
const bookComponent = defineAsyncComponent({
  loader: () => import('src/content/contentElements/book.vue'),
});

const writeComponent = defineAsyncComponent({
  loader: () => import('src/content/rootComponents/tester.vue'),
});

const { t } = useI18n();

const props = defineProps({});

const widgets = ref([
  {
    label: t('index.user'),
    icon: 'fa-solid fa-user',
    isVisible: true,
    name: 'user',
    datatable: 'users',
    data: [],
  },
  {
    label: t('index.books'),
    icon: 'fa-solid fa-book',
    isVisible: true,
    name: 'book',
    datatable: 'books',
    data: [],
  },
]);

const currentComponent = ref(writeComponent);
const tab = ref('mails');

watch(
  () => contents.value['mode'],
  (newValue) => {
    setComponent(newValue);
  }
);

const setComponent = (component: any) => {
  switch (component) {
    case 'book':
      currentComponent.value = bookComponent;
      break;
    case 'write':
      currentComponent.value = writeComponent;
  }
};

const onWidgetVisibilityChange = (widgetIndex: number) => {
  widgets.value[widgetIndex].isVisible = !widgets.value[widgetIndex].isVisible;
};

onMounted(async () => {
  /*await lang.loadData('components/content', 'index');*/
});
</script>
