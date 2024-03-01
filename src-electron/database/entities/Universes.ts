import tables from './../tables';

const tableName = 'universes';
async function setup() {
  await tables.create(
    tableName,
    [
      { notNullable: true, type: 'integer', columnName: 'projectId' },
      { notNullable: true, type: 'string', columnName: 'summary' },
      { type: 'json', columnName: 'dynamicData' }
    ]);


}


export default { setup };
