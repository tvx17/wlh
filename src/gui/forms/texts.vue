<script lang="ts" setup>
import { useApp } from 'src/app/useApp';
import { useListContainer } from 'src/gui/components/container/list';
import eDateTime from 'src/gui/elements/dateTime.vue';
import eDisplay from 'src/gui/elements/display.vue';
import eInput from 'src/gui/elements/input.vue';
import { onMounted } from 'vue';

const { i18n } = useApp();
const { v, m, on } = useListContainer();

onMounted(async () => {
  //await i18n.loadData('forms', 'texts')
  await i18n.loadData('common', 'fields');
});
</script>
<template lang="pug">
  div(class="q-pa-md")
    e-display(
      :display-value="v.dataset.value.id"
      label="ID")
    e-input(
      v-model="v.dataset.value.summary"
      label="Summary")
    q-separator
    //-q-editor(
      v-model="v.dataset.value.data['text']")
    e-date-time(
      :created-at-label="$t('common.fields.createdAt')"
      :updated-at-label="$t('common.fields.updatedAt')"
      :created-at="v.dataset.value.createdAt"
      :updated-at="v.dataset.value.updatedAt")
</template>

