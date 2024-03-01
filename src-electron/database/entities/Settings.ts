import log from '../../common/log';
import conn from './../connection';
import helper from './../helper';
import tables from './../tables';

const tableName = 'settings';

async function setup(projectId: number) {
  const exists = await tables.create(
    tableName,
    [
      { notNullable: true, type: 'integer', columnName: 'projectId' },
      { notNullable: true, type: 'string', columnName: 'key' },
      { type: 'json', columnName: 'data' }
    ]);

  if (!exists) {
    await _initialData(projectId);
  }

}

async function _initialData(projectId: number) {
  log.message(`Table ${tableName} created. Filling in some initial data...`, 'info');
  const updatedAt = helper.dtValue();
  const createdAt = helper.dtValue();
  await conn.db.insert(
    {
      projectId: 0,
      key: 'currentProject',
      data: projectId,
      createdAt: createdAt,
      updatedAt: updatedAt
    }).into(tableName);
  await conn.db.insert(
    {
      projectId: projectId,
      key: 'useUniverses',
      data: JSON.stringify({ useUniverses: false, useUniverseSections: false }),
      createdAt: createdAt,
      updatedAt: updatedAt
    }).into(tableName);
  await conn.db.insert(
    {
      projectId: projectId,
      key: 'optionsSex',
      data: JSON.stringify([{ id: 1, value: 'male' }, { id: 2, value: 'female' }, { id: 3, value: 'diverse' }]),
      createdAt: createdAt,
      updatedAt: updatedAt
    }).into(tableName);
  await conn.db.insert(
    {
      projectId: projectId,
      key: 'panels',
      data: JSON.stringify([{ id: 'panel0', col: 0, row: 0, sizeX: 3, sizeY: 3, form: 'books' ,header: 'Books' }]),
      createdAt: createdAt,
      updatedAt: updatedAt
    }).into(tableName);
  await conn.db.insert(
    {
      projectId: projectId,
      key: 'userdefinedPanelViews',
      data: JSON.stringify([]),
      createdAt: createdAt,
      updatedAt: updatedAt
    }).into(tableName);
}

export default { setup };
