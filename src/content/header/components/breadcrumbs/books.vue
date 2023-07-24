<template>
  <q-btn-dropdown
    flat
    :label="!currentBook ? $t('books.noBookSelected') : currentBook.summary"
    split
    @click="onBookEdit"
  >
    <widget
      datatable="books"
      label="Bücher"
      mode="both"
      @on:select="onSelect"
    />
  </q-btn-dropdown>
</template>

<script setup lang="ts">
interface iOnSelect {
  id: number;
  index: number;
}

import { defineAsyncComponent, onMounted } from "vue";
import { notifies } from 'src/tvx/helper/messages';
import { currentBook, contents } from 'src/app/store';
import crud, { crudModes } from 'src/tvx/helper/crud';
import lang from 'src/app/lang'

import { useI18n } from 'vue-i18n';

const widget = defineAsyncComponent({
  loader: () => import("src/content/elements/widget.vue"),
})

const { t} = useI18n({ useScope: 'global'});

const onShow = () => {
  console.log('onShow');
};

const onBookEdit = () => {
  if (!currentBook.value) {
    notifies.generic({ message: t('books.chooseFirst')});
  } else {
    console.log('onBookEdit');
    contents.value.type = 'editContent';
    contents.value.mode = 'book';
  }
};

const onSelect = (data: iOnSelect) => {
  console.log('onSelect', data);
  crud
    .readByPk({
      destination: 'books',
      pkValue: data.id,
      overrideCrudMode: crudModes.sequelize,
    })
    .then((r) => {
      currentBook.value = r;
    });
};

onMounted(async () => {
  lang.loadData('layouts/main/breadcrumbs', 'books');
});
</script>
