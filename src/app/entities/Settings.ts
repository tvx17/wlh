import {useApp} from 'src/app/useApp';
const {crud} = useApp()
import log from 'src/app/code/logging';

import store from 'src/app/store'

const _table = 'settings'

export async function get(key: string, useProjectId = true) {
  log.message('src/app/entities/Settings.ts', 'get', 'Getting settings for key: '+ key);
  const where = {key:key }
  if (useProjectId) {
    where['projectId'] = store.projectCurrent.value.toString()
  }
  const res = await window.db.read(_table, {where: where, returnColumns: ['data']})
  console.log(res)
  log.message('src/app/entities/Settings.ts', 'get', `Got settings for key "${key}": `, res);
  return res
}

export async function set(key: string, value: any) {
  // do nothing
}

export function exportMethods() {
  return {get, set}
}

export default {get, set}
