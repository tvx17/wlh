<script lang="ts" setup>
import { useListContainer } from 'src/gui/components/container/list';
import {useApp} from 'src/app/useApp';
import eDateTime from 'src/gui/elements/dateTime.vue';
import eDisplay from 'src/gui/elements/display.vue';
import eInput from 'src/gui/elements/input.vue';
import eSelect from 'src/gui/elements/select.vue';
import { onMounted } from 'vue';

const {i18n} = useApp();
const { v, m, on } = useListContainer();

onMounted( async() => {
  await i18n.loadData('forms', 'projects')
  await i18n.loadData('common', 'fields')
});

</script>


<template lang="pug">
  div(v-if="Object.keys(v.dataset).length > 0" class="q-pa-md")
    e-display(
      :display-value="v.dataset.value['id']"
      :label="$t('common.fields.id')")
    e-input(
      v-model="v.dataset.value['summary']"
      label="Project")
    e-select(
      v-model="v.dataset.value['owner']"
      label="Owner"
      :source="{ table: 'users', returnColumns: ['data', 'summary'] }")
    e-date-time(
      :created-at="v.dataset.value['createdAt']"
      :updated-at="v.dataset.value['updatedAt']"
      :created-at-label="$t('common.fields.createdAt')"
      :updated-at-label="$t('common.fields.updatedAt')")
</template>

