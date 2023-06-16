<template>
  <span>
    <span>
      <button-datatable-selection
        form="books"
        datatable="books"
        no-data-text="Kein Buch vorhanden!"
        button-site="left"
      />
    </span>
    <span v-if="store.currentBook.value"><q-icon name="fa-solid fa-chevron-right"/></span>
    <span v-if="store.currentBook.value"><q-btn label="Kapitel"/></span>
    <span v-if="store.currentChapter.value"><q-icon name="fa-solid fa-chevron-right"/></span>
    <span v-if="store.currentChapter.value"><q-btn label="Szene"/></span>
  </span>


</template>

<script setup>
import {onMounted, watch} from 'vue';

import ButtonDatatableSelection from 'components/buttons/_old/buttonDataSelection/index.vue';
import store from 'src/app/store';

watch(()=>store.currentProject.value.id, (newValue)=>{
  console.log(newValue)
})



</script>
