import {useConfig} from 'src/composables/useConfig';

const {cConstants} = useConfig();

class Create {
  private readonly _table: string;
  private readonly _data: object;

  constructor(table: string) {
    this._table = table;
    this._data = {};
  }

  columnValue(column: string, value: any) {
    this._data[column] = value;
    return this;
  }

  data(data: object) {
    if (Object.keys(this._data) > 0) {
      this._data = {...data};
    } else {
      this._data = data;
    }
    return this;
  }

  async execute() {
    return await window.db.query('create', {table: this._table, data: this._data});
  }
}

export async function create(table: string): Promise<object | null> {
  console.log('========================================================================================');
  if (cConstants.appRunMode === 'desktop') {
    return new Create(table);
  }
  return null;
}

class Read {
  private readonly _table: string;
  private readonly _id: number;
  private readonly _where: object;
  private readonly _order: object;
  private readonly _limit: number;
  private readonly _offset: number;
  private readonly _raw: boolean;
  private readonly _max: number;
  private readonly _returnColumns: object;
  private readonly _includeDeleted: boolean;

  constructor(table: string) {
    this._table = table;
    this._id = 0;
    this._where = {};
    this._order = {};
    this._limit = 0;
    this._offset = 0;
    this._raw = false;
    this._max = 100;
    this._returnColumns = [];
    this._includeDeleted = false;
  }

  id(id: number) {
    this._id = id;
    return this;
  }

  where(column: string, value: any, operator = '=') {
    if (this._id !== 0) {
      throw new Error('ID and where cannot be used together');
    }
    this._where[column] = value;
    return this;
  }

  order(order: object) {
    this._order = order;
    return this;
  }

  limit(limit: number) {
    this._limit = limit;
    return this;
  }

  offset(offset: number) {
    this._offset = offset;
    return this;
  }

  raw(rawQuery: boolean) {
    this._raw = rawQuery;
    return this;
  }

  max(amount: number) {
    this._max = amount;
    return this;
  }

  returnColumns(columns: object) {
    this._returnColumns = columns;
    return this;
  }

  includeDeleted(include: boolean) {
    this._includeDeleted = include;
    return this;
  }

  async execute() {
    return await read(this._table, {
      id: this._id,
      where: this._where,
      order: this._order,
      limit: this._limit,
      offset: this._offset,
      raw: this._raw,
      max: this._max,
      returnColumns: this._returnColumns,
    }, this._includeDeleted);
  }
}


export async function read(table: string): Promise<object | boolean> {
  return new Read(table);
}

/*export async function read({
 table='',
 id=0,
 where = {},
 orderBy = {},
 limit = 0,
 offset = 0,
 raw = false,
 max = 100,
 returnColumns = [],
 includeDeleted = false}): Promise<object | boolean> {
 console.log(
 'AppCrud.READ',
 'table:', table,
 'id:', id,
 'where:',where,
 'orderBy:', orderBy,
 'limit:', limit,
 'offset:', offset,
 'raw:',raw,
 'max:',max,
 'returnColumns:',returnColumns)
 console.log('========================================================================================')
 if (cConstants.appRunMode === 'desktop') {
 const params = {
 table: table,
 id: id,
 where: where,
 orderBy: orderBy,
 limit: limit,
 offset: offset,
 raw: raw,
 max: max,
 returnColumns: returnColumns,
 includeDeleted: includeDeleted
 }
 const res = await window.db.query('read',params)
 console.log('AppCrud.READ', res)
 return res
 }
 }*/

class Update {
  private readonly _table: string;
  private readonly _id: number;
  private readonly _data: object;

  constructor(table: string) {
    this._table = table;
    this._id = 0;
    this._data = {};
  }

  id(id: number) {
    this._id = id;
    return this;
  }

  data(data: object) {
    this._data = data;
    return this;
  }

  async execute() {
    return await update(this._table, this._data);
  }
}

export async function update(table: string, data: object): Promise<void> {
  console.log('AppCrud.update', table, data);
  console.log('========================================================================================');
  if (cConstants.appRunMode === 'desktop') {
    await window.db.query('update', {table: table, data: data});
  }
}

class Delete {
  private readonly _table: string;
  private readonly _id: number;

  constructor(table: string) {
    this._table = table;
    this._id = 0;
  }

  id(id: number) {
    this._id = id;
    return this;
  }

  async execute() {
    return await del(this._table, this._id);
  }
}

export async function del(table: string, id = 0) {
  console.log('AppCrud.del', table, id);
  console.log('========================================================================================');
  if (cConstants.appRunMode === 'desktop') {
    await window.db.delete(table, id);
    return;
  }
}

export async function init() {
  if (cConstants.appRunMode === 'desktop') {
    await window.db.query('init');
    console.log('Dahinter');
  }
}

export default {
  create, read, update,
  delete: del, init,
};
