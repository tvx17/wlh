<script setup lang="ts">

import { forms } from 'src/app/constants/forms';
import { inject } from 'vue';

const displayDialog = inject('displayDialog');

const emit = defineEmits(['on:formSelected']);

</script>

<template>
<q-dialog v-model="displayDialog">
    <q-card style="min-width: 90%">
      <q-card-section>
        <div class="text-h6">Choose component to display:</div>
      </q-card-section>
      <q-card-section>
        <div class="row items-center">
          <q-card v-for="(form, formIndex) of forms"
                  :key="formIndex"
                  class="cursor-pointer"
                  @click="emit('on:formSelected', forms[formIndex]['form'])">
            <q-card-section>{{ form['header'] }}</q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
