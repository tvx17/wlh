import {ref} from "vue";

const currentProject = ref()
const currentUser = ref()


const contents = ref({type: 'index', mode: ''})

const store = {
  currentProject,
  currentUser,
  contents
}

export default store

export {store, currentProject, contents, currentUser}
