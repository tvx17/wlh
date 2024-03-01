import log from '../../common/log';
import conn from './../connection';
import helper from './../helper';
import tables from './../tables';

const tableName = 'projects';

export async function setup(userId: number) {
  const exists = await tables.create(tableName, [
    { notNullable: true, type: 'string', columnName: 'summary' },
    { type: 'json', columnName: 'dynamicData' },
    { notNullable: true, type: 'integer', columnName: 'owner' }
  ]);

  if (!exists) {
    return await _initialData(userId);
  }
}

async function _initialData(userId: number) {
  log.message(`Table ${tableName} created. Filling in some initial data...`, 'info');
  const result = await conn.db.insert(
    {
      summary: 'My project',
      owner: userId,
      createdAt: helper.dtValue(),
      updatedAt: helper.dtValue(),
      deletedAt: ''
    }).into(tableName);
  return result[0];
}

export default { setup };
