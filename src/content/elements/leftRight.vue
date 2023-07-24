<template>
  <q-card style="width: 25%">
    <q-card-section>Charaktere</q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col">
          <div>In Buch</div>
          <div>
            <q-list dense separator>
              <q-item
                v-for="(char, index) in inBook"
                :key="index"
                @click="push('notIn', index)"
                clickable
              >
                <q-item-section>{{ char.label }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
        <div class="col">
          <div>Verfügbar</div>
          <div>
            <q-list dense separator>
              <q-item
                v-for="(char, index) in notInBook"
                :key="index"
                @click="push('in', index)"
                clickable
              >
                <q-item-section>{{ char.label }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
const props = defineProps({});
const emit = defineEmits([]);
</script>
