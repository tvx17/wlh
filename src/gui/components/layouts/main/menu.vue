<template>
  <q-btn v-if="props.display" dense :disable="props.disable" flat icon="fas fa-cog" round>
    <q-menu>
      <q-list>
        <q-item clickable>
          <q-item-section>Settings</q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section>Profile</q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section>Logout</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts" setup>
const props = defineProps(
  {
    disable: {
      type: Boolean,
      required: false,
      default: false
    },
    display: {
      type: Boolean,
      required: false
    }
  });

</script>

<style scoped>

</style>
