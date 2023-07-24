import crud from 'src/tvx/helper/crud';
import store from 'src/app/store';

const onStartup = async () => {
  await loadUser(localStorage.getItem('currentUserId'))
}

const loadUser = async (id = null) => {
  if (id !== undefined && id != null) {
    crud.readByPk({destination: 'users', pkValue: id}).then(res => {
      store.currentUser.value = res
      localStorage.setItem('currentUserId', res.id)
    })
  } else {
    crud.readFirst({destination: 'users'}).then(res => {
      store.currentUser.value = res
      localStorage.setItem('currentUserId', res.id)
    })
  }
}

const methods = {
  onStartup,
  loadUser
}

export default methods

export {methods, onStartup, loadUser,}
