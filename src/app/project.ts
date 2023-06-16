import crud from "src/app/crud";
import store from "src/app/store";

const onStartup = async () => {
  await loadProject(localStorage.getItem('currentProjectId'))
}

const loadProject = async (id = null) => {
  if (id !== undefined && id == null) {
    const data = await crud.r({table: 'projects', id: id})
    store.currentProject.value = data
    localStorage.setItem('currentProjectId', data.id)
  } else {
    const data = await crud.r({table: 'projects', getFirst: true})

    store.currentProject.value = data
    localStorage.setItem('currentProjectId', data.id)
  }
}

const methods = {
  onStartup,
  loadProject
}

export default methods

export {methods, onStartup, loadProject}
