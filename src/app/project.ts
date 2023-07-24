import crud from 'src/tvx/helper/crud';
import store from 'src/app/store';

const onStartup = async () => {
  console.log(localStorage.getItem('currentProjectId'))
  await loadProject(localStorage.getItem('currentProjectId'))
}

const loadProject = async (id = null) => {
  if (id !== undefined && id == null) {
    crud.readByPk({destination: 'projects', pkValue: id}).then(res => {
      store.currentProject.value = res
      localStorage.setItem('currentProjectId', res.id)
    })
  } else {
    crud.readFirst({destination: 'projects'}).then(res => {
      store.currentProject.value = res
      localStorage.setItem('currentProjectId', res.id)
    })
  }
}

const methods = {
  onStartup,
  loadProject
}

export default methods

export {methods, onStartup, loadProject,}
