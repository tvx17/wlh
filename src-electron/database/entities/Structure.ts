import conn from './../connection';
import helper from './../helper';
import tables from './../tables';
import log from '../../common/log'

const tableName = 'structure';
export async function setup(bookId: number, chapterId: number, textId: number, projectId: number) {
  const exists = await tables.create(tableName, [
    { notNullable: true, type: 'integer', columnName: 'projectId' },
    { notNullable: true, type: 'string', columnName: 'structureId' },
    { notNullable: true, type: 'string', columnName: 'type' },
    { type: 'integer', columnName: 'parent' },
    { type: 'integer', columnName: 'referenceId' }
  ]);
  if (!exists) {
    return await _initialData(bookId, chapterId, textId, projectId);
  }


}

async function _initialData(bookId: number, chapterId: number, textId: number, projectId: number) {
  log.message(`Table ${tableName} created. Filling in some initial data...`, 'info');
  const updatedAt = helper.dtValue();
  const createdAt = helper.dtValue();
  let res = await conn.db.insert(
    {
      projectId: projectId,
      structureId: helper.createID(projectId),
      type: 'book',
      parent: 0,
      referenceId: bookId,
      createdAt: createdAt,
      updatedAt: updatedAt
    }).into(tableName);
  res = await conn.db.insert(
    {
      projectId: projectId,
      structureId: helper.createID(projectId),
      type: 'chapter',
      parent: res[0],
      referenceId: chapterId,
      createdAt: createdAt,
      updatedAt: updatedAt
    }).into(tableName);
  await conn.db.insert(
    {
      projectId: projectId,
      structureId: helper.createID(projectId),
      type: 'text',
      parent: res[0],
      referenceId: textId,
      createdAt: createdAt,
      updatedAt: updatedAt
    }).into(tableName);

}

export default { setup };
