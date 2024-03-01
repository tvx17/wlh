<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {useApp} from 'src/app/useApp';
const {i18n} = useApp();


const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

onMounted(async() => {
  leftDrawerOpen.value = false;
  rightDrawerOpen.value = false;
  await i18n.loadData('layouts', 'main')
});
</script>
<template lang="pug">
  q-layout(view="hHh lpR fFf")
    q-header(bordered class="bg-primary text-white" height-hint="98")
      q-toolbar
        q-btn(dense flat icon="menu" round @click="leftDrawerOpen = !leftDrawerOpen")
        q-toolbar-title
          | WLH
        q-btn(dense flat icon="menu" round @click="rightDrawerOpen = !rightDrawerOpen")
    q-drawer(v-model="leftDrawerOpen" elevated show-if-above side="left")
      q-expansion-item(icon="settings" :label="$t('layouts.main.basics')" dense expand-separator)
        q-list(dense selectable)
          q-item(clickable to="/projects")
            q-item-section
              q-item-label
                | {{ $t('layouts.main.projects') }}
          q-item(clickable to="/users")
            q-item-section
              q-item-label
                | {{ $t('layouts.main.users') }}
      q-expansion-item(icon="settings" :label="$t('layouts.main.settings')" dense expand-separator)
        q-list(dense)
          q-item(disable)
            q-item-section
              q-item-label
                | {{ $t('layouts.main.common') }}
          q-item(disable)
            q-item-section
              q-item-label
                | {{ $t('layouts.main.notifications') }}
      q-expansion-item(icon="settings" :label="$t('layouts.main.structure')" dense expand-separator)
        q-list(dense)
          q-item(disable)
            q-item-section
              q-item-label
                | {{ $t('layouts.main.structure') }}
          q-item(disable)
            q-item-section
              q-item-label
                | {{ $t('layouts.main.storylines') }}
          q-item(clickable)
            q-item-section
              q-item-label
                | {{$t('layouts.main.books')}}
          q-item(clickable)
            q-item-section
              q-item-label
                | {{$t('layouts.main.chapters')}}
          q-item(clickable)
            q-item-section
              q-item-label
                | {{$t('layouts.main.scenes')}}
      q-expansion-item(icon="settings" :label="$t('layouts.main.contents')" dense expand-separator disable)
        q-list(dense)
          q-item(disable)
            q-item-section
              q-item-label
                | {{ $t('layouts.main.characters') }}
          q-item(disable)
            q-item-section
              q-item-label
                | {{ $t('layouts.main.locations') }}
          q-item(disable)
            q-item-section
              q-item-label
                | {{ $t('layouts.main.objects') }}
          q-item(clickable)
            q-item-section
              q-item-label
                | {{$t('layouts.main.relations')}}
      q-expansion-item(icon="settings" :label="$t('layouts.main.worldBuilding')" dense expand-separator disable)
      q-expansion-item(icon="settings" :label="$t('layouts.main.overviews')" dense expand-separator disable)
    q-drawer(v-model="rightDrawerOpen" elevated show-if-above side="right")
    q-page-container
      router-view
    q-footer(bordered class="bg-grey-8 text-white")
      q-toolbar
        q-toolbar-title
          | Unten
</template>

