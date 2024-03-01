import log from 'src/app/code/logging';
import constants from 'src/app/constants';

export async function create(table: string, data: object): Promise<object | null> {
  let lastCreatedId = null
  console.log('AppCrud.create', table, data)
  console.log('========================================================================================');
  if (constants.app.appRunMode === 'desktop') {
    lastCreatedId = await window.db.create(table, data);
  }
  return lastCreatedId;
}

export async function read(table: string,
                           {
                             id = 0,
                             where = {},
                             orderBy = {},
                             limit = 0,
                             offset = 0,
                             raw = false,
                             max = 100,
                             returnColumns = []

                           }, includeDeleted = false) {
  const params = {
    id: id,
    where: where,
    orderBy: orderBy,
    limit: limit,
    offset: offset,
    raw: raw,
    max: max,
    returnColumns: returnColumns
  };
  console.log(
    'AppCrud.READ',
    'table:', table,
    'id:', id,
    'where:', where,
    'orderBy:', orderBy,
    'limit:', limit,
    'offset:', offset,
    'raw:', raw,
    'max:', max,
    'returnColumns:', returnColumns,
    'includeDeleted:', includeDeleted
  );
  if (constants.app.appRunMode === 'desktop') {
    const res = await window.db.read(table, params, includeDeleted);
    console.log('AppCrud.READ', res);
    return res;
  }
}

export async function update(table: string, data: object, where: object): Promise<void> {
  console.log('AppCrud.update', table, data, where);
  console.log('========================================================================================');
  if (constants.app.appRunMode === 'desktop') {
    await window.db.update(table, data, where);
  }
}
export async function del(table: string, where: object, softDelete = true): Promise<void> {
  console.log('AppCrud.delete', table, where);
  console.log('========================================================================================');
  if (constants.app.appRunMode === 'desktop') {
    await window.db.delete(table, where, softDelete);
  }
}


export async function init() {
  if (constants.app.appRunMode === 'desktop') {
    log.message('src/app/crud.ts', 'init', 'App in desktop mode, initializing db...');
    await window.db.init();
  }
}

export default {
  init, read, update, create, delete: del
};
