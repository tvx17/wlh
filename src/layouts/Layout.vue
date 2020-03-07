<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-btn(
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu")
        q-toolbar-title
          |Writer's little helper
        div|{{version}}
        q-btn(dense flat round icon="menu" @click="rightDrawerOpen = !rightDrawerOpen")
    q-drawer(
      v-model="leftDrawerOpen"
      show-if-above
      behavior="default"
      elevated=""
      bordered
      content-class="bg-grey-2")
      StructreTree
    q-drawer(show-if-above v-model="rightDrawerOpen" side="right" overlay
      behavior="mobile"
      elevated)
      |Einstellungen
      |Charaktere
    q-page-container
      router-view
</template>

<script>
import StructreTree from '../components/layout/structure_tree'

export default {
  name: 'Layout',
  components: { StructreTree },
  data () {
    return {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      version: '0.0.1'
    }
  },
  methods: {
    makeid (length) {
      var result = ''
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      var charactersLength = characters.length
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    }
  },
  async mounted () {

  }
}
</script>
