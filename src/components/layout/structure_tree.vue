<template lang="pug">
  div
    |Knoten: {{selectedID}} - {{Dialogs.newNode.visible}} - {{ModeName}}
    q-dialog(v-model="Dialogs.editNode.visible")
      q-card(v-if="Dialogs.editNode.Data")
        q-card-section
          div(class="text-h6")|Knoten bearbeiten
        q-card-section(class="q-pt-none")
          div(class="row")
            div(class="col")
              q-input(v-model="Dialogs.editNode.Data.label" label="Name")
        q-card-actions(align="right")
          q-btn(flat label="Speichern" color="primary" @click="saveEditedData()")
          q-btn(flat label="Abbruch" color="primary" v-close-popup)
    q-dialog(v-model="Dialogs.newNode.visible")
      q-card(v-if="ModeName")
        q-card-section
          div(class="text-h6")|Welchen Typ soll der neue Knoten haben?
        q-card-section(class="q-pt-none")
          q-list(bordered separator)
            q-item(v-if="VisibleNewNodeTypes('section')" clickable v-ripple @click="Dialogs.newNode.visible = false; onAddNode('section')")
              q-item-section
                q-item-label(overline)|Abschnitt
                q-item-label(caption)|Ein Abschnitt kann Kapitel, Szenen und Text enthalten
            q-item(v-if="VisibleNewNodeTypes('chapter')" clickable v-ripple @click="Dialogs.newNode.visible = false; onAddNode('chapter')")
              q-item-section
                q-item-label(overline)|Kapitel
                q-item-label(caption)|Ein Kapitel kann Szenen oder Text enthalten
            q-item(v-if="VisibleNewNodeTypes('scene')" clickable v-ripple @click="Dialogs.newNode.visible = false; onAddNode('scene')")
              q-item-section
                q-item-label(overline)|Szene
                q-item-label(caption)|Eine Szene kann verschiedene Texte enthalten
            q-item(v-if="VisibleNewNodeTypes('text')" clickable v-ripple @click="Dialogs.newNode.visible = false; onAddNode('text')")
              q-item-section
                q-item-label(overline)|Text
                q-item-label(caption)|Der geschriebene Text
        q-card-actions(align="right")
          q-btn(flat label="Abbruch" color="primary" v-close-popup)
    div()
     |{{ModeMessage}}
     q-btn-group(spread flat)
      q-btn(v-if="Buttons.add" icon="add" @click="onAddNode()" round size="sm")
      q-btn(v-if="Buttons.delete" icon="remove" @click="TreeMode('delete')" round size="sm")
      q-btn(v-if="Buttons.ok" icon="check" @click="Execute('ok')" round size="sm" color="green")
      q-btn(v-if="Buttons.cancel" icon="cancel" @click="Execute('cancel')" round size="sm" color="red")
      q-btn(v-if="Buttons.move" icon="control_camera" round size="sm" @click="TreeMode('move')")
      q-btn(v-if="Buttons.edit" icon="create" round size="sm" @click="TreeMode('edit')")
    q-tree(
      ref="treeStructure"
      :nodes="Data"
      node-key="id"
      :filter="Filter"
      :selected.sync="selectedID"
      @lazy-load="onLazyLoad"
      @update:selected="onSelection"
      )
      template(v-slot:default-header="prop")
        |({{prop.node.type}})&nbsp;{{prop.node.label}}
</template>

<script>
export default {
  name: 'structure_tree',
  prop: ['value'],
  data: () => ({
    Buttons: {
      add: true,
      delete: false,
      move: false,
      edit: false,
      ok: false,
      cancel: false
    },
    Dialogs: {
      newNode: {
        visible: false,
        Type: ''
      },
      editNode: {
        visible: false,
        Data: null
      }
    },
    Path: '',
    selectedNode: null,
    selectedID: '',
    savedID: '',
    expandedNode: [],
    Filter: '',
    ModeName: '',
    ModeMessage: '',
    ModeActivated: false,
    Data: []
  }),
  mounted () {
    this.PrepareFirstLoad()
  },
  methods: {
    handleInput (e) {
      this.$emit('input', this.content)
    },
    onResetFilter () {
      this.filter = ''
      this.$refs.filter.focus()
    },
    async PrepareFirstLoad () {
      const lobjData = await this.$d.getAll('structure')
      lobjData.forEach(Entry => {
        if (Entry.root) {
          this.Data.push(Entry)
        }
      })
    },
    buttonVisibility (Button) {
      let lboolVisible = false
      if (Button === 'add') {
        if (this.selectedID === '' || this.selectedID) {
          lboolVisible = true
        }
        if (this.selectedNode && this.selectedNode.type !== 'text') {
          lboolVisible = true
        } else {
          lboolVisible = false
        }
      }
      console.log(Button)
      return lboolVisible
    },
    Execute (Action = '') {
      console.log(Action)
      if (Action !== '') {
        if (Action === 'cancel' && this.ModeName === 'move') {
          this.moveDeactivations(this.Data, true, ['book', 'section', 'chapter', 'scene', 'text'])
          this.selectedNode.disabled = false
          this.TreeButtons({ add: this.selectedNode.type !== 'text', delete: true, move: this.selectedNode.type !== 'book', edit: true, ok: false, cancel: false })
        }
        if (Action === 'ok' && this.ModeName === 'delete') {
          console.log('Delete it')
          if (this.selectedID !== '') {
            const lobjData = this.$refs.treeStructure.getNodeByKey(this.selectedID)
            lobjData.lazy = false
            this.$d.update('structure', lobjData)
            this.buildPath(this.Data)
            this.$d.delete('structure', this.selectedID)

            this.selectedID = ''
            this.TreeMode()
          }
          // delete this.Data[0].children
          this.selectedID = ''
        }
        if (Action === 'ok' && this.ModeName === 'move') {
          const lobjNewNode = this.$refs.treeStructure.getNodeByKey(this.selectedID)
          const lobjMoveNode = this.$refs.treeStructure.getNodeByKey(this.savedID)
          const lobjOldNode = this.$refs.treeStructure.getNodeByKey(lobjMoveNode.parent)
          for (let lintCounter = 0; lintCounter < lobjOldNode.children.length; lintCounter++) {
            if (lobjOldNode.children[lintCounter].id === lobjMoveNode.id) {
              lobjOldNode.children.splice(lintCounter, 1)
            }
          }
          if (lobjOldNode.children.length === 0) {
            delete lobjOldNode.children
          }

          if (Object.prototype.hasOwnProperty.call(lobjNewNode, 'children')) {
            lobjNewNode.children.push(lobjMoveNode)
          } else {
            lobjNewNode.children = []
            lobjNewNode.children.push(lobjMoveNode)
          }

          lobjMoveNode.parent = lobjNewNode.id
          lobjMoveNode.disabled = false
          lobjMoveNode.selectable = true
          const lobjCloneMoveNode = { ...lobjMoveNode }
          this.$d.update('structure', lobjCloneMoveNode)

          lobjNewNode.lazy = true
          const lobjCloneNewNode = { ...lobjNewNode }
          delete lobjCloneNewNode.children
          this.$d.update('structure', lobjCloneNewNode)
          this.TreeButtons({ add: this.selectedNode.type !== 'text', delete: true, move: this.selectedNode.type !== 'book', edit: true, ok: false, cancel: false })

          this.ModeName = ''
        }
      } else {
        switch (this.ModeName) {
          case 'delete':
            this.onDeleteNode()
            break
          case 'move':
            break
        }
      }
    },
    saveEditedData () {
      this.selectedNode = this.$refs.treeStructure.getNodeByKey(this.selectedID)
      Object.keys(this.Dialogs.editNode.Data).forEach(Key => {
        this.selectedNode[Key] = this.Dialogs.editNode.Data[Key]
      })
      let lobjSaveNode
      Object.assign(lobjSaveNode, this.selectedNode)
      // let lobjSaveNode = { ...this.selectedNode }
      delete lobjSaveNode.children
      this.$d.update('structure', lobjSaveNode)
      this.Dialogs.editNode.visible = false
      this.Dialogs.editNode.Data = []
    },
    VisibleNewNodeTypes (DisplayType) {
      if (this.selectedNode.type === 'book') {
        switch (DisplayType) {
          case 'section':
          case 'chapter':
          case 'scene':
          case 'text':
            return true
        }
      }
      if (this.selectedNode.type === 'section') {
        switch (DisplayType) {
          case 'chapter':
          case 'scene':
          case 'text':
            return true
        }
      }
      if (this.selectedNode.type === 'chapter') {
        switch (DisplayType) {
          case 'scene':
          case 'text':
            return true
        }
      }
      if (this.selectedNode.type === 'scene') {
        switch (DisplayType) {
          case 'text':
            return true
        }
      }
      if (DisplayType === 'text') {
        return true
      }
    },
    TreeMode (Mode) {
      if (Mode !== undefined) {
        this.ModeName = Mode
        switch (Mode) {
          case 'add':
            break
          case 'delete':
            this.ModeMessage = 'Möchtest Du wirklich den Knoten löschen?'
            this.TreeButtons({ add: false, delete: false, move: false, edit: false, ok: true, cancel: true })
            break
          case 'move':
            this.ModeMessage = 'Bitte den Zielknoten auswählen'
            this.selectedNode = this.$refs.treeStructure.getNodeByKey(this.selectedID)
            this.selectedNode.disabled = true
            this.savedID = this.selectedID
            this.selectedID = null
            this.TreeButtons({ add: false, delete: false, move: false, edit: false, ok: false, cancel: true })
            this.onMoveNode()
            break
          case 'edit':
            this.Dialogs.editNode.visible = true
            this.Dialogs.editNode.Data = { ...this.$refs.treeStructure.getNodeByKey(this.selectedID) }
            break
        }
      } else {
        this.TreeButtons({ add: true, delete: true, move: true, edit: true, ok: false, cancel: false })
        this.ModeName = ''
        this.ModeMessage = ''
      }
    },
    TreeButtons (Buttons) {
      this.Buttons.add = Buttons.add
      this.Buttons.delete = Buttons.delete
      this.Buttons.move = Buttons.move
      this.Buttons.edit = Buttons.edit
      this.Buttons.ok = Buttons.ok
      this.Buttons.cancel = Buttons.cancel
    },
    async onLazyLoad ({ node, key, done, fail }) {
      const lobjChildren = []
      const lobjNodes = await this.$d.getAll('structure')
      lobjNodes.forEach(Node => {
        if (Node.parent === key) {
          if (this.ModeName === 'move') {
            Node.selectable = false
          }
          lobjChildren.push(Node)
        }
      })
      done(lobjChildren)
    },
    moveDeactivations (Tree, Status, Types) {
      for (let lintCounter = 0; lintCounter < length; lintCounter++) {
        if (!Types.includes(Tree[lintCounter].type)) {
          Tree[lintCounter].selectable = Status
        }

        if (Object.prototype.hasOwnProperty.call(Tree[lintCounter], 'children')) {
          this.moveDeactivations(Tree[lintCounter].children, Status, Types)
        }
      }
    },
    onMoveNode () {
      let larrTypes
      switch (this.selectedNode.type) {
        case 'text':
          larrTypes = ['book', 'section', 'chapter', 'scene']
          break
        case 'scene':
          larrTypes = ['book', 'section', 'chapter']
          break
        case 'chapter':
          larrTypes = ['book', 'section']
          break
        case 'section':
          larrTypes = ['book']
          break
      }
      this.moveDeactivations(this.Data, false, larrTypes)
    },
    onSelection () {
      console.log(this.selectedID)
      console.log(this.ModeName)
      if (this.ModeName !== 'move') {
        if (this.selectedID !== null) {
          this.selectedNode = this.$refs.treeStructure.getNodeByKey(this.selectedID)
          this.TreeButtons({ add: this.selectedNode.type !== 'text', delete: true, move: this.selectedNode.type !== 'book', edit: true, ok: false, cancel: false })
          if (this.selectedNode.type === 'text') {
            this.$store.commit('app/setActiveText', this.selectedNode.textID)
          }
        } else {
          this.TreeButtons({ add: true, delete: false, move: false, edit: false, ok: false, cancel: false })
        }
      } else {
        this.TreeButtons({ add: false, delete: false, move: false, edit: false, ok: true, cancel: true })
      }
    },
    onDeleteNode () {

    },
    buildPath (SearchObject) {
      for (let lintCounter = 0; lintCounter < SearchObject.length; lintCounter++) {
        if (SearchObject[lintCounter].id === this.selectedID) {
          delete SearchObject[lintCounter]
          return
        }
        if (Object.prototype.hasOwnProperty.call(SearchObject[lintCounter], 'children')) {
          this.buildPath(SearchObject[lintCounter].children)
          if (SearchObject[lintCounter].children.length === 0) {
            delete SearchObject[lintCounter].children
          }
        }
      }
    },
    async newNode (Data) {
      let lmixTextID = null
      if (Data.Type === 'text') {
        lmixTextID = this.$help.createText()
      }
      let lobjData = {
        label: 'New ' + Data.Type,
        type: Data.Type,
        selectable: true,
        lazy: Data.Lazy,
        root: Data.Root,
        parent: Data.Parent,
        project: Data.Project,
        textID: lmixTextID
      }
      const lintID = await this.$d.set('structure',
        lobjData
      )
      lobjData.id = lintID
      if (Data.Root) {
        this.Data.push(lobjData)
      } else {
        if (!Object.prototype.hasOwnProperty.call(this.selectedNode, 'children')) {
          this.selectedNode.children = []
        }
        this.selectedNode.children.push(lobjData)
        lobjData = this.selectedNode
        delete lobjData.children

        lobjData.lazy = true
        this.$d.update('structure', lobjData)
      }
      this.selectedID = ''
    },
    async onAddNode (Type = false) {
      if (!Type) {
        if (this.selectedID !== '') {
          this.selectedNode = this.$refs.treeStructure.getNodeByKey(this.selectedID)
          if (this.selectedNode.type !== 'scene') {
            this.ModeName = 'add'
            this.Dialogs.newNode.visible = true
          } else {
            this.newNode({ Type: 'text', Lazy: false, Root: false, Parent: this.selectedNode.id, Project: localStorage.getItem('wlh_app_currentProjectID'), textID: this.$help.createText() })
          }
        } else {
          this.newNode({ Type: 'book', Lazy: false, Root: true, Parent: 0, Project: localStorage.getItem('wlh_app_currentProjectID'), textID: null })
        }
      } else {
        if (Type === 'text') {
          this.newNode({ Type: 'text', Lazy: false, Root: false, Parent: this.selectedNode.id, Project: localStorage.getItem('wlh_app_currentProjectID'), textID: this.$help.createText() })
        } else {
          this.newNode({ Type: Type, Lazy: false, Root: false, Parent: this.selectedNode.id, Project: localStorage.getItem('wlh_app_currentProjectID'), textID: null })
        }
      }
    }
  }
}
</script>
