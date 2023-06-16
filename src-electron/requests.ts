import { checkFiles, initTables, insertInitialData } from './setupDatabase';
import { connectionObject } from './connection';
import { tables } from './tables';

const setupCheck = async () => {
  await checkFiles();

  try {
    await connectionObject.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the datatable:', error);
    return;
  }

  await initTables();
  await insertInitialData();
};

const create = async (table: string, params: { [index: string]: any }) => {
  internalChecks(table);
  const newDataset = tables[table].build(params);
  const results = await newDataset.save();
  return results.id;
};
const read = async (table: string, params?: { [index: string]: any }) => {
  let results;
  if (params === undefined) {
    params = {}
  }
  internalChecks(table);
  if (!params.hasOwnProperty('mode')) {
    params['mode'] = 'all';
  }
  switch (params['mode']) {
    case 'all':
      return await tables[table].findAll({ raw: true });
    case 'findAllByQuery':
      return await tables[table].findAll({
        where: params['where'],
        raw: true,
      });
    case 'findByPk':
      return await tables[table].findByPk(params['id'], { raw: true });
    case 'count':
      return await tables[table].count();
    case 'first':
      return await tables[table].findOne({ raw: true });
  }
};
const update = async (table: string, params: { [index: string]: any }) => {
  internalChecks(table);
  const { id } = params['data'];
  delete params['data']['id'];

  await tables[table].update(params['data'], { where: { id: id } });
};
const deleteDataset = async (table: string, id: number) => {
  await tables[table].update({ deleted: true }, { where: { id: id } });
  //await iTables[table].destroy({where: {id: id}});
};
const internalChecks = (table: string) => {
  if (table === undefined) {
    throw new Error('WLH-Electron: Table undefined');
  }
};

const methods: any = {
  setupCheck,
  create,
  read,
  update,
  deleteDataset,
  internalChecks,
};

export default methods;

export {
  methods,
  setupCheck,
  create,
  read,
  update,
  deleteDataset,
  internalChecks,
};
