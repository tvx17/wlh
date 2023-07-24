<template>
  <div class="q-gutter-y-xs" v-if="langLoaded">
    <q-select
      :options="[$t('write.bookOne'), $t('write.bookTwo')]"
      dense
      v-model="currentBook"
      disable
    />
    <q-splitter v-model="splitterModel">
      <template #before>
        <div class="q-pa-xs">
          <q-btn-group flat class="full-width">
            <q-btn :label="$t('write.newSceneShort')" flat dense size="xs" class="full-width" :disable="buttons.newScene"
                   @click="treeButtonAction('newScene')">
              <q-tooltip>{{$t('write.newScene')}}</q-tooltip>
            </q-btn>
            <q-btn :label="$t('write.newGroupShort')" flat dense size="xs" class="full-width" :disable="buttons.newGroup"
                   @click="treeButtonAction('newGroup')">
              <q-tooltip>{{$t('write.newGroup')}}</q-tooltip>
            </q-btn>
            <q-btn :label="$t('write.newBookSectionShort')" flat dense size="xs" class="full-width" :disable="buttons.newBookSection"
                   @click="treeButtonAction('newBookSection')">
              <q-tooltip>{{$t('write.newBookSection')}}</q-tooltip>
            </q-btn>
            <q-btn :label="$t('write.newChapterSectionShort')" flat dense size="xs" class="full-width" :disable="buttons.newChapterSection"
                   @click="treeButtonAction('newChapterSection')">
              <q-tooltip>{{$t('write.newChapterSection')}}</q-tooltip>
            </q-btn>
            <q-btn :label="$t('write.newChapterShort')" flat dense size="xs" class="full-width" :disable="buttons.newChapter"
                   @click="treeButtonAction('newChapter')">
              <q-tooltip>{{$t('write.newChapter')}}</q-tooltip>
            </q-btn>
          </q-btn-group>
          <q-tree
            ref="theTree"
            dense
            :nodes="tree"
            node-key="key"
            label-key="summary"
            @update:selected="updateSelected"
            v-model:selected="selected"
          >
          </q-tree>
        </div>
      </template>
      <template #after>
        <div class="q-pa-xs" v-if="Object.keys(detailsText).length > 0">
          <q-btn icon="fa-solid fa-save" flat dense class="full-width" color="primary" @click="onSave"/>

          <q-input v-model="detailsText.summary" dense/>
          <br/>
          <q-editor v-model="detailsText.text"/>
        </div>
      </template>
    </q-splitter>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue';
import crud, {crudModes} from 'src/tvx/helper/crud';
import {currentProject} from 'src/app/store';
import lang from 'src/app/lang'
import {useI18n} from "vue-i18n";

const i18n = useI18n()
const {t} = i18n

const splitterModel = ref(25);
const theTree = ref();
const selected = ref(null);
const currentBook = ref(t('write.bookOne'));
const details = ref({})
const detailsText = ref({})
const langLoaded = ref(false)


const buttons = ref({
  newScene: false,
  newGroup: true,
  newChapter: true,
  newBookSection: true,
  newChapterSection: true,
})

const tree = ref([
  {
    label: 'Scene 1',
    icon: 'fa-solid fa-font',
    key: 'scene_1',
    id: 1,
    type: 'scene',
  },
]);


const updateSelected = async (node: any) => {
  if (node != null) {
    const selectedNode = theTree.value.getNodeByKey(node);
    console.log('-------------------------------')
    console.log(node, selectedNode);
    console.log('-------------------------------')
    switch (selectedNode.type) {
      case 'scene':
        break
    }
    details.value = await crud.readByPk({destination: 'structure', pkValue: selectedNode.id})
    detailsText.value = await crud.readByColumnId({destination:'texts', column: 'structureId', value: selectedNode.id})
  } else {
    details.value = {}
  }
};

const onSave = async () => {

  await crud.save({destination: 'texts', data: detailsText.value})
}

const treeButtonAction = async (action: string) => {
  switch (action) {
    case 'newScene':
      let nextOrderValue = await crud.readAll({destination: 'structure', distinct: 'order'})
      nextOrderValue = nextOrderValue[0]['maxorder'] + 10
      const id = await crud.c({
        destination: 'structure', data: {
          summary: 'Just a new scene',
          type: 'scene',
          order: nextOrderValue,
          parent: 0,
          project: currentProject.value.id,
        }
      })
      crud.c({
        destination: 'texts', data: {
          summary: 'Just a new scene',
          structureId: id,
          project: currentProject.value.id,
          isActive: 1,
          deleted: 0

        }
      })

      break
    case 'newGroup':
      break
    case 'newChapter':
      break
    case 'newBookSection':
      break
    case 'newChapterSection':
      break

  }
}

onMounted(async() => {
  langLoaded.value = await lang.loadData('rootComponents','write')
  crud.readAll({
    destination: 'structure',
    orderBy: [['order', 'ASC']],
    overrideCrudMode: crudModes.sequelize,
  }).then((res) => {
    tree.value = res
    for (const node of tree.value) {
      node['key'] = 'scene_' + node.id
      node['icon'] = 'fa-solid fa-font'
      node['type'] = 'scene'
    }
  })
})
</script>
