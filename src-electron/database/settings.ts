import os from 'os';
import path from 'path';

export const logVerbose = true

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignorec
export const localTables = {}
export const dataDir = os.homedir() + '/.wlh'
export const dbSchemaFile = path.join(dataDir, 'dbSchema.json')
export const dbFile = path.join(dataDir, 'data.db')

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore

export default {
  logVerbose, localTables, dataDir, dbSchemaFile, dbFile
}
