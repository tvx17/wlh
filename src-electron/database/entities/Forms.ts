import conn from './../connection';
import helper from './../helper';
import tables from './../tables';

const tableName = 'forms';

export async function setup() {
  await tables.create(tableName, [
    {notNullable: true, type: 'string', columnName: 'projectId'},
    {notNullable: true, type: 'string', columnName: 'summary'},
    {type: 'json', columnName: 'formData'},
  ]);


}

export default {setup};
