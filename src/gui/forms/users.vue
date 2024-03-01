<script lang="ts" setup>
import { useApp } from 'src/app/useApp';
import { useListContainer } from 'src/gui/components/container/list';
import eDateTime from 'src/gui/elements/dateTime.vue';
import eDisplay from 'src/gui/elements/display.vue';
import eInput from 'src/gui/elements/input.vue';
import eSelect from 'src/gui/elements/select.vue';
import { onMounted } from 'vue';

const {i18n} = useApp();
const { v, m, on } = useListContainer();


onMounted( async() => {
  await i18n.loadData('forms', 'users')
  await i18n.loadData('common', 'fields')
});
</script>

<template lang="pug">
  div(
    class="q-pa-md"
    v-if="Object.keys(v.dataset.value).length > 0")
    e-display(
      :label="$t('common.fields.id')"
      :display-value="v.dataset.value['id']")
    e-input(
      :label="$t('common.fields.summary')"
      v-model="v.dataset.value['summary']")
    e-input(
      :label="$t('forms.users.firstname')"
      v-model="v.dataset.value['firstname']")
    e-input(
      :label="$t('forms.users.lastname')"
      v-model="v.dataset.value['lastname']")
    e-input(
      :label="$t('forms.users.pseudonym')"
      v-model="v.dataset.value['pseudonym']")
    e-select(
      v-model="v.dataset.value['sex']"
      :label="$t('forms.users.sex')"
      :source="{ table: 'settings', returnColumns: ['data'], where: { key:'optionsSex'}, isJson: true, options: { value: 'id', label: 'value' } }")
    e-date-time(
      :updated-at="v.dataset.value['updatedAt']"
      :created-at="v.dataset.value['createdAt']")

</template>


