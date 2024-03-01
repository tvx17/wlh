import dbSettings from './settings';
import * as log from '../common/log'
import fs from 'fs';

export let db: any = null

function _openDatabase() {
  return require('knex')({
    client: 'sqlite3',
    connection: {
      filename: dbSettings.dbFile
    },
    useNullAsDefault: true
  })
}

async function _checkDataDir(): Promise<boolean> {
  if (!fs.existsSync(dbSettings.dataDir)) {
    log.message('Data directory does not exist, creating it now.')
    fs.mkdirSync(dbSettings.dataDir)
    return false
  }
  return true
}

export async function dbCheck() {
  if (db == null || db === undefined) {
    await _checkDataDir()
    db = _openDatabase()
    log.message('Database opened')
    return db
  } else {
    log.message('Database already opened')
    return db
  }
}

export default {db, dbCheck}
