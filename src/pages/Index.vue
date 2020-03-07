<template lang="pug">
  q-page(class="q-pa-md")
    q-editor(
      v-if="Text.Text !== null && Text.Text !== ''"
      v-model="Text.Text"
      min-height="5rem"
      :definitions="{save: {tip: 'Text speichern',icon: 'save',label: 'Speichern',handler: saveWork}}"
    :toolbar="[['bold', 'italic', 'strike', 'underline'],['upload', 'save']]")
</template>

<script>
export default {
  name: 'Index',
  data: () => ({
    Text: {
      TextID: null,
      ID: null,
      Text: null
    },
    Data: {

      Characters: {
        Data: [],
        Available: [
          { label: 'Eins', value: 1 },
          { label: 'Zwei', value: 2 },
          { label: 'Drei', value: 3 }
        ]
      }
    },
    Editors: []
  }),
  watch: {},
  created () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'app/setActiveText') {
        this.textActivated(mutation.payload)
      }
    })
  },
  beforeMount () {

  },
  mounted () {
  },
  methods: {
    saveWork () {
      this.$q.notify({
        message: 'Text gespeichert',
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done'
      })
      const lmodFS = require('fs')
      const lmodPath = require('path')
      const VueInstance = this

      lmodFS.writeFile(lmodPath.join('C:\\Users\\ckoeste1\\source\\repos\\P\\P\\wlh\\v1\\data', VueInstance.Text.TextID), VueInstance.Text.Text, 'utf8', ErrorObject => {
        if (ErrorObject) throw ErrorObject
      })
    },
    async textActivated (TextID) {
      /* keyRange = IDBKeyRange.bound(
        ['444-44-4444', 'bill@bill@company.com'],
        ['444-44-4444', 'bill@bill@company.com', ''])
      objectStore.index('ssn, email, age').get(keyRange)
      objectStore.index('ssn, email, age').get(['444-44-4444', 'bill@bill@company.com', 30])
      objectStore.index('ssn, email, name').get(['444-44-4444', 'bill@bill@company.com', 'Bill']) */
      const lmodFS = require('fs')
      const lmodPath = require('path')
      const VueInstance = this

      lmodFS.readFile(lmodPath.join('C:\\Users\\ckoeste1\\source\\repos\\P\\P\\wlh\\v1\\data', TextID), 'utf8', (ErrorObject, Data) => {
        if (ErrorObject) throw ErrorObject
        VueInstance.Text.Text = Data
        VueInstance.Text.TextID = TextID
      })
    },
    makeDTID () {
      const ldtNow = new Date()
      return ldtNow.getFullYear().toString() + ldtNow.getMonth().toString() + ldtNow.getDate().toString() + ldtNow.getHours().toString() + ldtNow.getMinutes().toString() + ldtNow.getSeconds().toString() + ldtNow.getMilliseconds().toString() + this.makeid(5)
    },
    makeid (length) {
      var result = ''
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      var charactersLength = characters.length
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    },
    characters_onAddCharacter () {
      alert('Hallo')
    }
  }
}
</script>
