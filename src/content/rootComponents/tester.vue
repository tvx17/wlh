<template>
  <q-splitter v-model="splitterModel">
    <template #before>
      <q-tree
        dense
        :nodes="simple"
        node-key="key"
        @update:selected="updateSelected"
        v-model:selected="selected"
        nodekey="key"
      >
      </q-tree>
    </template>
    <template #after>
      Hallo: {{ selected }}
      <div v-if="mode === 'widget'">
        <widget
          :icon="theWidget.icon"
          :label="theWidget.label"
          :datatable="theWidget.datatable"
          mode="list"
          allow-size-change
        />
      </div>
      <div v-if="mode === 'component'">
        <component :is="currentComponent"></component>
      </div>
    </template>
  </q-splitter>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

const widgetButtons = defineAsyncComponent({
  loader: () => import('src/content/components/widgetButtons.vue'),
});

const widget = defineAsyncComponent({
  loader: () => import('src/content/elements/widget.vue'),
});

const theWidget = {
  label: 'Duser',
  icon: 'fa-solid fa-user',
  isVisible: true,
  name: 'user',
  datatable: 'users',
  data: [],
};

const mode = ref('widget');
const splitterModel = ref(25);
const selected = ref(null);
const currentComponent = ref('f');

const updateSelected = (node: any) => {
  console.log(node);
};

const simple = [
  {
    label: 'Characters',
    key: 'charakters',
    icon: 'fa-solid fa-users',
    children: [{ label: 'Quality ingredients' }, { label: 'Good recipe' }],
  },
  {
    label: 'Locations',
    key: 'locations',
    icon: 'fa-solid fa-location-dot',
    children: [{ label: 'Prompt attention' }, { label: 'Professional waiter' }],
  },
  {
    label: 'Objects',
    key: 'objects',
    icon: 'fa-solid fa-dumbbell',
    children: [
      {
        label: 'Happy atmosphere (with image)',
      },
      { label: 'Good table presentation' },
      { label: 'Pleasing decor' },
    ],
  },
  {
    label: 'Books',
    key: 'books',
    icon: 'fa-solid fa-book',
    children: [
      {
        label: 'Book 1',
        key: 'book_1',
        children: [
          {
            label: 'Group 1',
            icon: 'fa-solid fa-layer-group',
            key: 'group_1',
            children: [
              {
                label: 'Chapter 1',
                key: 'chapter_1',
                children: [
                  {
                    label: 'Section 1',
                    key: 'section_11',
                    icon: 'fa-solid fa-layer-group',
                    children: [{ label: 'Scene 1', key: 'scene_1' }],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'Book 2',
        children: [
          {
            label: 'Section 1',
            children: [
              {
                label: 'Chapter 1',
                children: [
                  { label: 'Section 1', children: [{ label: 'Scene 1' }] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
</script>
