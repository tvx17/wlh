import fs from 'fs';
import { dataDir } from './connection';

import { tables } from './tables';
import { methods } from './requests';

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

const insertInitialData = async () => {
  let userId = 0;
  const userData = await methods.read('users');
  if (userData.length === 0) {
    const user = tables['users'].build({
      summary: 'default user',
      firstname: 'Firstname',
      lastname: 'Lastname',
      pseudonym: 'Not set',
      gender: 1,
      isActive: true,
      deleted: false,
    });
    const row = await user.save();
    userId = row.id;
  }
  const projectData = await methods.getAll('projects');
  if (projectData.length === 0 && userId !== 0) {
    const project = tables['projects'].build({
      summary: 'default project',
      isActive: true,
      deleted: false,
      owner: userId,
    });
    await project.save();
  } else if (projectData.length === 0 && userId === 0) {
    console.error('Problem creating a new project because the user id was 0');
  }
};

export { checkFiles, initTables, insertInitialData };
