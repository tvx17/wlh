import tables from './../tables';


const tableName = 'universeSections';
async function setup() {
  const exists = await tables.create(
    tableName,
    [
      { notNullable: true, type: 'integer', columnName: 'projectId' },
      { notNullable: true, type: 'string', columnName: 'summary' },
      { type: 'json', columnName: 'dynamicData' }
    ]);
}

export default { setup };
