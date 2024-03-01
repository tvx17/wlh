import constants from 'src/app/constants';
import { useApp } from 'src/app/useApp';

const { logging } = useApp();

const _file = 'src/app/entities/index.ts';


interface ICommon {
  _table: string;
  _includeDeleted: boolean;
}

interface IParams {
  where: object;
  orderBy: object;
  limit: number;
  offset: number;
  raw: boolean;
  returnColumns: string[];
}


class Common implements ICommon {
  _table: string;
  _includeDeleted: boolean;
  _where: object;
  _orderBy: object;
  _limit: number;
  _offset: number;
  _raw: boolean;
  _returnColumns: string[];
  _softDelete: boolean;

  constructor(tableName?: string) {
    this._table = tableName ? tableName : '';
    this._includeDeleted = false;
    this._where = {};
    this._orderBy = {};
    this._limit = 0;
    this._offset = 0;
    this._raw = false;
    this._returnColumns = [];
    this._softDelete = true;
  }

  private _checkTable() {
    if (!this._table) {
      throw new Error('Table name not set');
    }
  }

  private async _read() {
    this._checkTable();
    const params: IParams = {
      where: this._where,
      orderBy: this._orderBy,
      limit: this._limit,
      offset: this._offset,
      raw: this._raw,
      returnColumns: this._returnColumns
    };

    if (constants.app.appRunMode === 'desktop') {
      const res = await window.db.read(this._table, params, this._includeDeleted);
      console.log('AppCrud.READ', res);
      return res;
    }
  }

  private async _update(data: { id?: number }) {
    this._checkTable();
    console.log('========================================================================================');
    if (Objects.keys(this._where).length === 0 && !data.hasOwnProperty('id')) {
      throw new Error('You need to provide a where clause or an id in the data object to update a record.');
    }
    if (Objects.keys(this._where).length === 0 && data.hasOwnProperty('id')) {
      this._where = { id: data.id };
    }
    console.log('AppCrud.update', this._table, data, this._where);
    if (constants.app.appRunMode === 'desktop') {
      await window.db.update(this._table, data, this._where);
    }
  }

  private async _delete(id?: number) {
    this._checkTable();
    console.log('========================================================================================');

    if (id) {
      this._where = { id: id };
    }
    if (Objects.keys(this._where).length === 0) {
      throw new Error('You need to provide a where clause or an id to delete a record.');
    }

    if (constants.app.appRunMode === 'desktop') {
      await window.db.delete(this._table, this._where, this._softDelete);
    }
  }


  private _restore() {
    //----
  }

  private _remove() {
    //----
  }

  private async _create(data: object) {
    let lastCreatedId = null;
    console.log('AppCrud.create', this._table, data);
    console.log('========================================================================================');
    if (constants.app.appRunMode === 'desktop') {
      lastCreatedId = await window.db.create(this._table, data);
    }
    return lastCreatedId;
  }

  public noSoftDelete() {
    this._softDelete = false;
    return this;
  }

  public where(where: object) {
    this._where = where;
    return this;
  }

  public orderBy(orderBy: object) {
    this._orderBy = orderBy;
    return this;
  }

  public limit(limit: number) {
    this._limit = limit;
    return this;
  }

  public offset(offset: number) {
    this._offset = offset;
    return this;
  }

  public raw(raw?: boolean) {
    this._raw = raw ? raw : true;
    return this;
  }

  public returnColumns(columns: string[]) {
    this._returnColumns = columns;
    return this;
  }

  public includeDeleted() {
    this._includeDeleted = true;
    return this;
  }


  public async readAll() {
    return await this._read();
  }

  public readOne() {
    //----
    this._limit = 1;
  }

  public readOneById(id: number) {
    this._where = { id: id };
    return this._read();
    //----
  }

  public async create(data: object) {
    await this._create(data);
  }

  public async update(data: object) {
    await this._update(data);
  }

  public async delete(id: number) {
    await this.deleteOneById(id);
  }

  public async deleteOneById(id: number) {
    await this._delete(id);
  }

  public deleteAll() {
    //----
  }

  public restoreOneById(id: number) {
    //----
  }

  public restoreAll() {
    //----
  }

  public async remove(id: number) {
    await this.removeOneById(id);
  }

  public async removeOneById(id: number) {
    this._softDelete = false;
    await this._delete(id);
  }

  public async init() {
    if (constants.app.appRunMode === 'desktop') {
      logging.message(_file, 'common->init', 'App in desktop mode, initializing db...');
      await window.db.init();
    }
  }

}

export function common(tableName?: string) {
  return new Common(tableName);
}

export class Books extends Common {
  constructor() {
    super('books');
  }
}

export function books() {
  return new Books();
}

class Chapters extends Common {
  constructor() {
    super('chapters');
  }
}

export function chapters() {
  return new Chapters();
}

class ChapterSections extends Common {
  constructor() {
    super('chapter_sections');
  }
}

export function chapterSections() {
  return new ChapterSections();
}

class Characters extends Common {
  constructor() {
    super('characters');
  }
}

export function characters() {
  return new Characters();
}

class Forms extends Common {
  constructor() {
    super('forms');
  }
}

export function forms() {
  return new Forms();
}

class Locations extends Common {
  constructor() {
    super('locations');
  }
}

export function locations() {
  return new Locations();
}

class Objects extends Common {
  constructor() {
    super('objects');
  }
}

export function objects() {
  return new Objects();
}

class Projects extends Common {
  constructor() {
    super('projects');
  }
}

export function projects() {
  return new Projects();
}

class Structure extends Common {
  constructor() {
    super('structures');
  }
}

export function structure() {
  return new Structure();
}

class Texts extends Common {
  constructor() {
    super('texts');
  }
}

export function texts() {
  return new Texts();
}

class Universes extends Common {
  constructor() {
    super('universes');
  }
}

export function universes() {
  return new Universes();
}

class UniverseSections extends Common {
  constructor() {
    super('universe_sections');
  }
}

export function universeSections() {
  return new UniverseSections();
}

class Users extends Common {
  constructor() {
    super('users');
  }
}

export function users() {
  return new Users();
}


class Settings extends Common {
  constructor() {
    super('settings');
  }
}

export function settings() {
  return new Settings();
}

export function entity(tableName: string) {
  return new Common(tableName);
}


export const entities = {
  books, settings, chapters, chapterSections, characters, forms, locations, objects, projects, structure, texts, universes, universeSections, users, common
};

export default {
  books, settings, chapters, chapterSections, characters, forms, locations, objects, projects, structure, texts, universes, universeSections, users, common, entities
};

