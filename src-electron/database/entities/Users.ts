import conn from './../connection';
import helper from './../helper';
import tables from './../tables';
import log from '../../common/log'

const tableName = 'users';

export async function setup() {
  const exists = await tables.create(tableName, [
    { notNullable: true, type: 'string', columnName: 'summary' },
    { type: 'string', columnName: 'firstname' },
    { type: 'string', columnName: 'lastname' },
    { type: 'json', columnName: 'dynamicData' },
    { type: 'string', columnName: 'pseudonym' }
  ]);
  if (!exists) {
    return await _initialData();
  }

}

async function _initialData() {
  log.message(`Table ${tableName} created. Filling in some initial data...`, 'info');
  const result = await conn.db.insert(
    {
      summary: 'Default user',
      firstname: 'Firstname',
      lastname: 'Lastname',
      pseudonym: 'Not set yet',
      createdAt: helper.dtValue(),
      updatedAt: helper.dtValue(),
      deletedAt: ''
    }).into(tableName);
  return result[0];
}

export default { setup };
