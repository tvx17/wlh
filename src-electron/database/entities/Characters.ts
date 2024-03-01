import log from '../../common/log';
import conn from './../connection';
import helper from './../helper';
import tables from './../tables';

const tableName = 'characters';

export async function setup(projectId: number) {
  const exists = await tables.create(tableName, [
    { notNullable: true, type: 'integer', columnName: 'projectId' },
    { notNullable: true, type: 'string', columnName: 'summary' },
    { type: 'json', columnName: 'dynamicData' }
  ]);

  if (!exists) {
    return await _initialData(projectId);
  }

}

async function _initialData(projectId: number) {
  log.message(`Table ${tableName} created. Filling in some initial data...`, 'info');
  const result = await conn.db.insert(
    {
      projectId: projectId,
      summary: 'First Character',
      createdAt: helper.dtValue(),
      updatedAt: helper.dtValue()
    }).into(tableName);
  return result[0];
}

export default { setup };
