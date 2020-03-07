import Dexie from 'dexie'

const DB = new Dexie('whl2')

DB.version(1).stores({
  structure: '++id, label, type, selectable, root, parent, project',
  texts: '++id, text, parent',
  projects: '++id, name, active'
})

export default DB
