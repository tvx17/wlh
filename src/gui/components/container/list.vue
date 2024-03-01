<script lang="ts" setup>
// ---------------------------------------------------- Composables
// ================================================================
import { useListContainer } from 'src/gui/components/container/list';
import eList from 'src/gui/components/container/listElement.vue';
// ---------------------------------------------------- Elements
// =============================================================
import eButton from 'src/gui/components/container/toolbarButton.vue';

// ---------------------------------------------------- Forms
// ==========================================================
import projects from 'src/gui/forms/projects.vue';
import users from 'src/gui/forms/users.vue';

// ---------------------------------------------------- Props
// ==========================================================
const props = defineProps(
  {
    form: {
      type: String,
      required: true,
      default: ''
    }
  });

const { v, m, on } = useListContainer(props.form);
</script>
<template lang="pug">
  q-splitter(:limits="[25, 100]" v-model="v.splitter.value")
    template(v-slot:before)
      div(class="q-pa-md")
        q-btn-group(class="full-width" flat)
          e-button(button="add" :available="v.buttons.add.value" @click="on.add")
          e-button(button="edit" :available="v.buttons.edit.value" @click="on.edit")
          e-button(button="delete" :available="v.buttons.delete.value")
          e-button(button="cancel" :available="v.buttons.cancel.value" @click="on.cancel")
        e-list
    template(v-slot:after)
      q-btn(class="full-width" dense flat icon="fa-solid fa-save" size="sm" )
      projects(v-if="props.form === 'projects'")
      users(v-if="props.form === 'users'")
  //<!--  {{variables.splitter}}

  //<q-splitter v-model="variables.splitter.value" :limits="[0, 100]">
  //    <template v-slot:before>
    //    {{ props.form }}
      //  <q-btn-group class="full-width" flat>
        //  <e-form-button visible :available="variables.buttons.add.value" icon="fa-solid fa-plus" @click="on.add" />
          //<e-form-button visible :available="variables.buttons.edit.value" icon="fa-solid fa-edit" @click="on.edit" />
          //<e-form-button visible :available="variables.buttons.delete.value" icon="fa-solid fa-trash" @click="on.delete" />
          //<e-form-button visible :available="variables.buttons.cancel.value" icon="fa-solid fa-ban" @click="on.cancel" />
        //</q-btn-group>
        //<list />
      //<template v-slot:after>
  //      <q-btn class="full-width"
  //             dense
  //             flat
  //             icon="fa-solid fa-save"
  //             size="sm"
  //             @click="on.save" />
  //      <books v-if="props.form === 'books'" />
  //      <projects v-if="props.form === 'projects'" />
</template>


<style>

</style>
