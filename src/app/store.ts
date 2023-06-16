import {ref} from "vue";

const currentProject = ref()
const currentBook= ref()
const currentChapter= ref()
const currentScene= ref()


const store = {
  currentProject,
  currentBook,
  currentChapter,
  currentScene
}

export default store

export {store, currentProject, currentBook, currentChapter, currentScene}
