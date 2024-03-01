<script lang="ts" setup>
import variables from 'src/gui/components/formContainer/list/variables';
import eDateTime from 'src/gui/elements/dateTime.vue';
import eDisplay from 'src/gui/elements/display.vue';
import eInput from 'src/gui/elements/input.vue';
</script>

<template>
  <div class="q-pa-md">
    <e-display v-model="variables.dataset.value.id"
               label="ID" />
    <e-input v-model="variables.dataset.value.summary"
             label="Summary" />
    <e-date-time :created-at="variables.dataset.value.createdAt"
                 :updated-at="variables.dataset.value.updatedAt" />
  </div>
</template>

<style scoped>

</style>
