import fs from 'fs';
import {dataDir} from './connection';

import {tables} from './tables';
import {methods} from './requests';

const checkFiles = async () => {
  fs.access(dataDir, async (err) => {
    if (err && err.code === 'ENOENT') {
      await fs.mkdir(dataDir, (err) => {
        /*isNew = true;*/
      });
    }
  });
};

const initTables = async () => {
  for (const table in tables) {
    await tables[table].sync();
  }
};

const createDataset = async (table: string, dataToInsert: any) => {
  let id = 0
  const data = await methods.read(table);
  if (data.length === 0) {
    const dataset = tables[table].build(dataToInsert);
    const row = await dataset.save();
    id = row.id;
  }
  checkCreationErrors(id, table)
  return id
}
const checkCreationErrors = (id: number, table: string) => {
  if (id === 0) {
    throw new Error('Problems creating a new data row in table ' + table + '!');
  }
}

const insertInitialData = async () => {
  let id = await createDataset('users', {
    summary: 'default user',
    firstname: 'Firstname',
    lastname: 'Lastname',
    pseudonym: 'Not set',
    gender: 1,
    isActive: true,
    deleted: false,
  })
  const projectId = await createDataset('projects', {
    summary: 'default project',
    isActive: true,
    deleted: false,
    owner: id,
  })
  id = await createDataset('structure', {
    summary: 'First Scene',
    isActive: true,
    deleted: false,
    project: projectId,
    type: 'scene',
    parent: 0,
    order: 10
  })
  await createDataset('texts', {
    summary: 'Headline of the first scene',
    description: '',
    text: '',
    project: projectId,
    isActive: true,
    deleted: false,
    structureId: id
  })
};

export {checkFiles, initTables, insertInitialData};
