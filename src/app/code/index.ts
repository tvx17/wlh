import crud from './crud';
import entities from 'src/app/entities';
import log from 'src/app/code/logging';
import store from 'src/app/store'


export async function initApp() {
  log.message('src/app/index.ts', 'initApp', 'Initializing app...');
  await crud.init();
  const res = await entities.settings.get('currentProject', false)
  store.projectCurrent.value = res[0]['data']
}

export const index = {crud}



export default { index};
