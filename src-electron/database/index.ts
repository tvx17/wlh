import conn from 'app/src-electron/database/connection';
import log from '../common/log';
import Entities from './entities/Entities';
import helpers from './helper';

export async function query(query: string) {
  conn.db = await conn.dbCheck();
}

export async function init() {
  log.message('INIT ** Initializing database...');
  conn.db = await conn.dbCheck();
  await Entities.setup();
}

export async function create(table: string, data: object) {
  log.message(`CREATE ** Creating a new dataset in table "${table}"...`, 'info', { table, data });
  if (!data.hasOwnProperty('createdAt')) {
    data['createdAt'] = helpers.dtValue();
  }
  if (!data.hasOwnProperty('updatedAt')) {
    data['updatedAt'] = helpers.dtValue();
  }
  conn.db = await conn.dbCheck();
  const query = conn.db.insert(data).into(table);
  log.message('Query is: ' + query.toString());
  const res = await query;
  log.message('Result is: ', 'info', res);
  log.message('ID of last created record is: ', 'info', res[0]);
  return res[0];
}

export async function read(table: string, params: {
  table: string,
  id: number,
  where: object,
  order: object,
  limit: number,
  offset: number,
  returnColumns: string[], // returnColumns
  raw: boolean
}, includeDeleted = false) {
  log.message(`READ ** Reading data from table "${table}"...`, 'info', { table, params, includeDeleted });
  conn.db = await conn.dbCheck();

  const query = conn.db.select(params.returnColumns.length > 0 ? params.returnColumns : '*');
  query.from(table);

  if (params.id) {
    query.where('id', params.id);
  }

  if (params.where) {
    query.where(params.where);
  }
  if (!includeDeleted) {
    query.where('deletedAt', null);
  } else {
    query.where('deletedAt', '!=', null);
  }
  if (params.order) {
    query.orderBy(params.order);
  }
  if (params.limit) {
    query.limit(params.limit);
  }
  if (params.offset) {
    query.offset(params.offset);
  }

  log.message('Query is: ' + query.toString());

  const res = await query;

  log.message('Result is: ', 'info', res);

  return res;
}

export async function update(table: string, data: object, where: object) {
  log.message(`UPDATE ** Updating data in table "${table}"...`, 'info', { table, data, where });
  conn.db = await conn.dbCheck();
  const query = conn.db(table).where(where).update(data);
  log.message('Query is: ' + query.toString());
  const res = await query;
  log.message('Result is: ', 'info', res);
}

export async function del(table: string, where: object, softDelete = true) {
  log.message(`DELETE ** Deleting data in table "${table}"...`, 'info', { table, where, softDelete });
  conn.db = await conn.dbCheck();
  if(!softDelete) {
    log.message(`Deleting data in table "${table}" by removing dataset`);
  } else {
    log.message(`Deleting data in table "${table}" by setting deletedAt`);
    const query = conn.db(table).where(where).update({ deletedAt: helpers.dtValue() });
    log.message('Query is: ' + query.toString());
    const res = await query;
  }

}

export async function structure(parentId: number) {
  log.message(`STRUCTURE ** Getting data for structure for parent id "${parentId}"...`, 'info', { parentId });
  conn.db = await conn.dbCheck();
}

export default { query, init, create, read, update, delete: del, structure };
