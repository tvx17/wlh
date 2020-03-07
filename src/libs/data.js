import { Platform } from 'quasar'
import gobjElectron from './dataElectron'
import DateTime from './datetime'

const gmodMySQL = require('mysql')

let gconMySQL

export default {
  async init () {
    let lobjDBConnection = await this.databaseConnection()
    let lboolDBCreated = false
    if (lobjDBConnection) {
      lboolDBCreated = await this.createDatabase(lobjDBConnection)
    }
    if (lboolDBCreated) {
      await lobjDBConnection.destroy()
      lobjDBConnection = await this.databaseConnection(true)
      this.setupDB(lobjDBConnection)
    }
  },
  databaseConnection (Database = false) {
    return new Promise((resolve, reject) => {
      const lobjData = {
        host: 'localhost',
        user: 'root',
        password: 'Chris1901!'
      }
      if (Database) {
        lobjData.database = 'wlh'
      }
      const lobjConnection = gmodMySQL.createConnection(lobjData)
      lobjConnection.connect((ErrorObject) => {
        if (ErrorObject) throw reject
        resolve(lobjConnection)
      })
    })
  },
  createDatabase (DBConnection) {
    return new Promise((resolve, reject) => {
      DBConnection.query('CREATE DATABASE wlh', (ErrorObject, Result) => {
        if (ErrorObject) reject(false)
        resolve(true)
      })
    })
  },

  setupDB (DBConnection) {
    const lmodFS = require('fs')
    const lmodPath = require('path')
    const larrFiles = lmodFS.readdirSync('C:\\Users\\ckoeste1\\source\\repos\\P\\P\\wlh\\v1\\src\\statics\\tables')
    for (const lintFileIndex in larrFiles) {
      lmodFS.readFile(
        lmodPath.join('C:\\Users\\ckoeste1\\source\\repos\\P\\P\\wlh\\v1\\src\\statics\\tables', larrFiles[lintFileIndex]
        ),
        (ErrorObject, Result) => {
          if (ErrorObject) throw ErrorObject
          this.insertIntoDB(larrFiles[lintFileIndex].substring(0, larrFiles[lintFileIndex].indexOf('.')), JSON.parse(Result), DBConnection)
        }
      )
    }
    localStorage.setItem('wlh_db_setup', true)
  },
  insertIntoDB (TableName, TableStructure, DBConnection) {
    // eslint-disable-next-line no-unused-vars
    let lstrSQL = 'CREATE TABLE `' + TableName + '` ('
    let lstrSQLIndex = 'INDEX '
    TableStructure.forEach(ColumnData => {
      lstrSQL += '`' + ColumnData.name + '` ' + ColumnData.type
      lstrSQL += (Object.prototype.hasOwnProperty.call(ColumnData, 'length')) ? '(' + ColumnData.length + ')' : ''
      lstrSQL += (Object.prototype.hasOwnProperty.call(ColumnData, 'null')) ? ' NULL ' : ' NOT NULL '
      lstrSQL += (Object.prototype.hasOwnProperty.call(ColumnData, 'default')) ? ' DEFAULT \'' + ColumnData.default + '\'' : ''

      if (ColumnData.autoIncrement) {
        lstrSQLIndex += '`' + ColumnData.name + '` (`' + ColumnData.name + '`)'
        lstrSQL += ' AUTO_INCREMENT '
      }
      lstrSQL += ', '
    })
    lstrSQL += lstrSQLIndex + ')'
    lstrSQL += 'COLLATE=\'utf8_general_ci\''
    lstrSQL += 'ENGINE=InnoDB'
    lstrSQL += ';'
    DBConnection.query(lstrSQL, (ErrorObject, Result) => {
      if (ErrorObject) throw ErrorObject
      console.log('Table created')
    })
  },
  createID (Type) {
    switch (Type) {
      case 'structure_book':
        return 'sb' + DateTime.dtID()
    }
  },
  delete (Type, ID) {
    if (Platform.is.electron) {
      return gobjElectron.delete(Type, ID)
    }
  },
  getAll (Type) {
    if (Platform.is.electron) {
      return gobjElectron.getAll(Type)
    }
  },
  get (Type, Where) {
    if (Platform.is.electron) {
      return gobjElectron.get(Type, Where)
    }
  },
  getRange (Type, Indices, KeyRange) {
    if (Platform.is.electron) {
      return gobjElectron.getRange(Type, Indices, KeyRange)
    }
  },
  getMulti (Type, Where) {
    if (Platform.is.electron) {
      console.log(Type, Where)
      return gobjElectron.getMulti(Type, Where)
    }
  },
  async set (Table, Data) {
    // eslint-disable-next-line no-unused-vars
    let lstrColumns = ''
    let lstrData = ''
    Object.keys(Data).forEach(Column => {
      lstrColumns += Column + ', '
      switch (typeof Data[Column]) {
        case 'boolean':
          if (Data[Column]) {
            lstrData += 1 + ', '
          } else {
            lstrData += 0 + ', '
          }
          break
        default:
          lstrData += "'" + Data[Column] + "', "
          break
      }
    })
    const lstrSQL =
      'INSERT INTO ' +
      Table +
      ' (' +
      lstrColumns.substring(0, lstrColumns.length - 2) +
      ') VALUES (' +
      lstrData.substring(0, lstrData.length - 2) +
      ')'
    this.query(lstrSQL, true)
  },
  execute (DBInstance, SQLQuery, Return = false) {
    console.log(SQLQuery)
    DBInstance.query(SQLQuery, (err, result) => {
      if (err) throw err
      console.log('Inserted dataset(s)')
      console.log(result)
      if (Return) {
        return result.insertId
      }
    })
  },
  async query (SQLQuery, Return = false) {
    if (this.gconMySQL === undefined) {
      this.databaseConnection(true).then(DBConnection => {
        this.gconMySQL = DBConnection
        this.execute(DBConnection, SQLQuery, Return)
      })
    } else {
      this.execute(gconMySQL, SQLQuery, Return)
    }
  },
  update (Type, Data) {
    if (Platform.is.electron) {
      return gobjElectron.update(Type, Data)
    }
  }
}
