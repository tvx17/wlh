<template>
  <span>
    <span>
      <breadcrumbs-books/>
    </span>

    <span v-if="currentBook"> / Aktuelles Kapitel: Kapitel 1 </span>
    <span v-if="currentChapter"> Szene 1 </span>
  </span>
</template>

<script setup lang="ts">
import breadcrumbsBooks from 'src/content/header/components/breadcrumbs/books.vue';
import { currentBook, currentChapter } from 'src/app/store';


</script>
