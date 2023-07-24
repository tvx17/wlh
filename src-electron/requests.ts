import {checkFiles, initTables, insertInitialData} from './setupDatabase';
import {connectionObject} from './connection';
import {tables} from './tables';
import {Sequelize} from "sequelize";

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
  console.log('CREATE')
  console.log('Create:', table, params);
  internalChecks(table);
  const newDataset = tables[table].build(params);
  const results = await newDataset.save();
  return results.id;
};
const read = async (table: string, params?: { [index: string]: any }) => {
  console.log('READ');

  let results;
  if (params === undefined) {
    params = {};
  }
  internalChecks(table);
  console.log('------------------------------------------');

  console.log(table, params);

  if (!params.hasOwnProperty('mode')) {
    params['mode'] = 'readAll';
  }
  const options = {raw: true}
  if (params.hasOwnProperty('where')) {
    options['where'] = params['where'];
  }
  if (params.hasOwnProperty('orderBy')) {
    options['order'] = params['orderBy'];
  }
  if(params.hasOwnProperty('distinct') && params.distinct !== '') {
    const distinct = []
    distinct.push(Sequelize.fn('MAX', Sequelize.col(params.distinct)), params.distinct)
    distinct.push(params.distinct)

    options['attributes'] = [[Sequelize.fn('MAX', Sequelize.col(params.distinct)), 'max' + params.distinct]];
  }

  console.log(options)

  switch (params['mode']) {
    case 'readAll':
      return await tables[table].findAll(options);
    case 'readAllByQuery':

      return await tables[table].findAll(options);
    case 'readByPk':
      return await tables[table].findByPk(params['id'], options);
    case 'readCount':
      return await tables[table].count();
    case 'readFirst':
      return await tables[table].findOne(options);
  }
};
const update = async (table: string, params: { [index: string]: any }) => {
  internalChecks(table);
  let id = null;
  if (params.hasOwnProperty('id')) {
    id = params['id'];
    delete params['id'];
  }
  if (!id) {
    throw new Error('No valid id');
  }
  tables[table].update(params, {where: {id: id}}).then(r => {
    if (r === 0) {
      throw new Error('Fehler beim Speichern des Datensatzes');
    }
  });
};
const deleteDataset = async (table: string, id: number) => {
  await tables[table].update({deleted: true}, {where: {id: id}});
  //await iTables[table].destroy({where: {currentEditId: currentEditId}});
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
