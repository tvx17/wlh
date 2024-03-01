import conn from './connection';
import log from '../common/log'


export async function create(tableName: string, tableData: object) {
  log.message(`Checking table "${tableName}"...`);
  if (tableName === '' || tableName === undefined || tableName === null) {
    log.message('Table name not provided', 'error');
    throw new Error('Table name not provided');
  }

  if (await conn.db.schema.hasTable(tableName)) {
    log.message(`Table "${tableName}" already exists, no need to create it.`, 'info');
    return true;
  }
  log.message(`Creating table "${tableName}"...`, 'info');

  await conn.db.schema.createTable(tableName, (table: any) => {

    table.increments('id').primary();
    for (const columnData of tableData) {

      switch (columnData['type']) {
        case 'string':
          if (columnData.hasOwnProperty('notNullable') && columnData['notNullable'] === true) {
            table.string(columnData['columnName']).notNullable();
          } else {
            table.string(columnData['columnName']);
          }
          break;
        case 'integer':
          if (columnData.hasOwnProperty('notNullable') && columnData['notNullable'] === true) {
            table.integer(columnData['columnName']).notNullable();
          } else {
            table.integer(columnData['columnName']);
          }
          break;
        case 'json':
          if (columnData.hasOwnProperty('notNullable') && columnData['notNullable'] === true) {
            table.json(columnData['columnName']).notNullable();
          } else {
            table.json(columnData['columnName']);
          }
          break;
        case 'timestamp':
          if (columnData.hasOwnProperty('notNullable') && columnData['notNullable'] === true) {
            table.timestamp(columnData['columnName']).notNullable();
          } else {
            table.timestamp(columnData['columnName']);
          }
          break;
      }
    }

    table.timestamp('createdAt').notNullable();
    table.timestamp('updatedAt').notNullable();
    table.timestamp('deletedAt');
  });
  return false;
}

export default { create };
