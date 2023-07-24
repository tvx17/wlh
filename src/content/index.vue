<template>
  <q-page class="q-pa-sm">
    <component :is="currentComponent" />
  </q-page>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { contents } from 'src/app/store';
import { lang } from 'src/app/lang';

const writeComponent = defineAsyncComponent({
  loader: () => import('src/content/rootComponents/write.vue'),
});
const contentsComponent = defineAsyncComponent({
  loader: () => import('src/content/rootComponents/contents.vue'),
});
const settingsComponent = defineAsyncComponent({
  loader: () => import('src/content/rootComponents/settings.vue'),
});

const homeComponent = defineAsyncComponent({
  loader: () => import('src/content/rootComponents/home.vue'),
});

const { t } = useI18n();

const currentComponent = ref(writeComponent);

watch(
  () => contents.value['mode'],
  (newValue) => {
    setComponent(newValue);
  }
);

const setComponent = (component: any) => {
  switch (component) {
    case 'home':
      currentComponent.value = homeComponent;
      break
    case 'write':
      currentComponent.value = writeComponent;
      break
    case 'settings':
      currentComponent.value = settingsComponent;
      break
    case 'contents':
      currentComponent.value = contentsComponent;
      break
  }
};

const onWidgetVisibilityChange = (widgetIndex: number) => {
  widgets.value[widgetIndex].isVisible = !widgets.value[widgetIndex].isVisible;
};

onMounted(async () => {
  /*await lang.loadData('components/content', 'index');*/
});
</script>
