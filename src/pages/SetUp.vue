<template lang="pug">
  div
    q-stepper(
      v-model="setup.step"
      vertical color="primary"
      animated)
      q-step(
        :name="1"
        :title="$l._('step1_name','setup')"
        icon="settings"
        :done="setup.step > 1")
        div(class="text-h5")|{{$l._('step1_headline','setup')}}
        div|{{$l._('step1_line1','setup')}}
        div|{{$l._('step1_line2','setup')}}
        div|{{$l._('step1_line3','setup')}}
        q-stepper-navigation
          q-btn(
            @click="setup.step = 2"
            :label="$l._('next','misc')"
            color="primary" )
      q-step(
        :name="2"
        :title="$l._('user','misc')"
        icon="create_new_folder"
        :done="setup.step > 2")
        q-input(
          v-model="setup.Name.First"
          :label="$l._('firstname', 'misc')")
        q-input(
          v-model="setup.Name.Last"
          :label="$l._('lastname', 'misc')")
        q-input(
          v-model="setup.Name.Short"
          :label="$l._('short', 'misc')")
        q-input(
          v-model="setup.Name.Pseudonym"
          :label="$l._('pseudonym', 'misc')")
        q-stepper-navigation
          q-btn(
            v-if="setup.Name.First.length > 4"
            @click="setup.step = 3"
            :label="$l._('next','misc')"
            color="primary")
      q-step(
        :name="3"
        :title="$l._('step3_headline', 'setup')"
        icon="assignment")
        div|{{$l._('step3_line1', 'setup')}}
        q-input(
          v-model="setup.Project"
          :label="$l._('projectname', 'misc')")
        q-stepper-navigation
          q-btn(
            v-if="setup.Project.length > 4"
            @click="done()"
            :label="$l._('ready', 'misc')"
            color="primary")
          q-btn(
            @click="setup.step = 3"
            :label="$l._('back', 'misc')"
            flat
            color="primary"
            class="q-ml-sm")
</template>

<script>

export default {
  name: 'setup',
  data: () => ({
    setup: {
      step: 1,
      Name: {
        First: '',
        Last: '',
        Pseudonym: '',
        Short: ''
      },
      Project: ''
    }
  }),

  methods: {
    async done () {
      localStorage.setItem('wlh_app_firstname', this.setup.Name.First)
      localStorage.setItem('wlh_app_lastname', this.setup.Name.Last)
      localStorage.setItem('wlh_app_pseydonym', this.setup.Name.Pseudonym)
      localStorage.setItem('wlh_app_short', this.setup.Name.Short)
      // localStorage.setItem('whl_app_configured', true)
      const lintProject = await this.$d.set('projects', {
        name: this.setup.Project,
        active: true
      })
      this.$d.set('projects', {
        name: this.setup.Project,
        active: true
      }).then(ID => {
        localStorage.setItem('wlh_app_currentProjectID', lintProject)
        this.$d.set('structure',
          {
            label: 'Mein erstes Buch',
            type: 'book',
            selectable: true,
            root: true,
            parent: 0,
            project: lintProject,
            lazy: false,
            textID: null
          }
        )
      })

      this.$router.push({ path: '/' })
    }
  }
}
</script>
