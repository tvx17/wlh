'use strict'

const path = require('path')
const fs = require('fs')
const SQL = require('sql.js')
const view = require(path.join(__dirname, 'view.js'))

/*
  SQL.js returns a compact object listing the columns separately from the
  values or rows of data. This function joins the column names and
  values into a single objects and collects these together by row id.
  {
    0: {first_name: "Jango", last_name: "Reinhardt", person_id: 1},
    1: {first_name: "Svend", last_name: "Asmussen", person_id: 2},
  }
  This format makes updating the markup easy when the DOM input id attribute
  is the same as the column name. See view.showPeople() for an example.
*/
const _rowsFromSqlDataObject = function (object) {
  const data = {}
  let i = 0
  let j = 0
  for (const valueArray of object.values) {
    data[i] = {}
    j = 0
    for (const column of object.columns) {
      Object.assign(data[i], { [column]: valueArray[j] })
      j++
    }
    i++
  }
  return data
}

/*
  Return a string of placeholders for use in a prepared statement.
*/
const _placeHoldersString = function (length) {
  let places = ''
  for (let i = 1; i <= length; i++) {
    places += '?, '
  }
  return /(.*),/.exec(places)[1]
}

SQL.dbOpen = function (databaseFileName) {
  try {
    return new SQL.Database(fs.readFileSync(databaseFileName))
  } catch (error) {
    console.log("Can't open database file.", error.message)
    return null
  }
}

SQL.dbClose = function (databaseHandle, databaseFileName) {
  try {
    const data = databaseHandle.export()
    const buffer = Buffer.alloc(data.length, data)
    fs.writeFileSync(databaseFileName, buffer)
    databaseHandle.close()
    return true
  } catch (error) {
    console.log("Can't close database file.", error)
    return null
  }
}

/*
  A function to create a new SQLite3 database from schema.sql.

  This function is called from main.js during initialization and that's why
  it's passed appPath. The rest of the model operates from renderer and uses
  window.model.db.
*/
module.exports.initDb = function (appPath, callback) {
  const dbPath = path.join(appPath, 'example.db')
  const createDb = function (dbPath) {
    // Create a database.
    const db = new SQL.Database()
    const query = fs.readFileSync(
      path.join(__dirname, 'db', 'schema.sql'),
      'utf8'
    )
    const result = db.exec(query)
    if (
      Object.keys(result).length === 0 &&
      typeof result.constructor === 'function' &&
      SQL.dbClose(db, dbPath)
    ) {
      console.log('Created a new database.')
    } else {
      console.log('model.initDb.createDb failed.')
    }
  }
  const db = SQL.dbOpen(dbPath)
  if (db === null) {
    /* The file doesn't exist so create a new database. */
    createDb(dbPath)
  } else {
    /*
      The file is a valid sqlite3 database. This simple query will demonstrate
      whether it's in good health or not.
    */
    const query = 'SELECT count(*) as `count` FROM `sqlite_master`'
    const row = db.exec(query)
    const tableCount = parseInt(row[0].values)
    if (tableCount === 0) {
      console.log('The file is an empty SQLite3 database.')
      createDb(dbPath)
    } else {
      console.log('The database has', tableCount, 'tables.')
    }
    if (typeof callback === 'function') {
      callback()
    }
  }
}

/*
  Populates the People List.
*/
module.exports.getPeople = function () {
  const db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    const query = 'SELECT * FROM `people` ORDER BY `last_name` ASC'
    try {
      let row = db.exec(query)
      if (row !== undefined && row.length > 0) {
        row = _rowsFromSqlDataObject(row[0])
        view.showPeople(row)
      }
    } catch (error) {
      console.log('model.getPeople', error.message)
    } finally {
      SQL.dbClose(db, window.model.db)
    }
  }
}

/*
  Fetch a person's data from the database.
*/
module.exports.getPerson = function (pid) {
  const db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    const query = 'SELECT * FROM `people` WHERE `person_id` IS ?'
    const statement = db.prepare(query, [pid])
    try {
      if (statement.step()) {
        const values = [statement.get()]
        const columns = statement.getColumnNames()
        return _rowsFromSqlDataObject({ values: values, columns: columns })
      } else {
        console.log('model.getPeople', 'No data found for person_id =', pid)
      }
    } catch (error) {
      console.log('model.getPeople', error.message)
    } finally {
      SQL.dbClose(db, window.model.db)
    }
  }
}

/*
  Delete a person's data from the database.
*/
module.exports.deletePerson = function (pid, callback) {
  const db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    const query = 'DELETE FROM `people` WHERE `person_id` IS ?'
    const statement = db.prepare(query)
    try {
      if (statement.run([pid])) {
        if (typeof callback === 'function') {
          callback()
        }
      } else {
        console.log('model.deletePerson', 'No data found for person_id =', pid)
      }
    } catch (error) {
      console.log('model.deletePerson', error.message)
    } finally {
      SQL.dbClose(db, window.model.db)
    }
  }
}

/*
  Insert or update a person's data in the database.
*/
module.exports.saveFormData = function (tableName, keyValue, callback) {
  if (keyValue.columns.length > 0) {
    const db = SQL.dbOpen(window.model.db)
    if (db !== null) {
      let query = 'INSERT OR REPLACE INTO `' + tableName
      query += '` (`' + keyValue.columns.join('`, `') + '`)'
      query += ' VALUES (' + _placeHoldersString(keyValue.values.length) + ')'
      const statement = db.prepare(query)
      try {
        if (statement.run(keyValue.values)) {
          /* $('#' + keyValue.columns.join(', #'))
            .addClass('form-control-success')
            .animate({ class: 'form-control-success' }, 1500, function () {
              if (typeof callback === 'function') {
                callback()
              }
            }) */
        } else {
          console.log('model.saveFormData', 'Query failed for', keyValue.values)
        }
      } catch (error) {
        console.log('model.saveFormData', error.message)
      } finally {
        SQL.dbClose(db, window.model.db)
      }
    }
  }
}
