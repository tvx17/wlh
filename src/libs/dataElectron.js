export default {
  delete (Type, Where) {
    return new Promise((resolve, reject) => {
      var dbRequest = indexedDB.open('wlh')

      dbRequest.onerror = function (event) {
        reject(Error('IndexedDB database error'))
      }

      dbRequest.onupgradeneeded = function (event) {
        event.target.transaction.abort()
        reject(Error('Database not found'))
      }

      dbRequest.onsuccess = function (event) {
        var database = event.target.result
        var transaction = database.transaction([Type], 'readwrite')
        var objectStore = transaction.objectStore(Type)
        var objectRequest = objectStore.delete(Where) // Overwrite if exists

        objectRequest.onerror = function (event) {
          reject(Error('Error during delete transaction'))
        }

        objectRequest.onsuccess = function (event) {
          resolve('Deleted ' + Where + ' from ' + Type)
        }
      }
    })
  },
  update (Type, Data) {
    return new Promise(function (resolve, reject) {
      var dbRequest = indexedDB.open('wlh')

      dbRequest.onerror = function (event) {
        reject(Error('IndexedDB database error'))
      }

      dbRequest.onupgradeneeded = function (event) {
        event.target.transaction.abort()
        reject(Error('Database not found'))
      }

      dbRequest.onsuccess = function (event) {
        var database = event.target.result
        var transaction = database.transaction([Type], 'readwrite')
        var objectStore = transaction.objectStore(Type)
        var objectRequest = objectStore.put(Data) // Overwrite if exists

        objectRequest.onerror = function (event) {
          reject(Error('Error during put transaction'))
        }

        objectRequest.onsuccess = function (event) {
          resolve(event.target.result)
        }
      }
    })
  },
  set (Type, Data) {
    return new Promise(function (resolve, reject) {
      var dbRequest = indexedDB.open('wlh')

      dbRequest.onerror = function (event) {
        reject(Error('IndexedDB database error'))
      }

      dbRequest.onupgradeneeded = function (event) {
        event.target.transaction.abort()
        reject(Error('Database not found'))
      }

      dbRequest.onsuccess = function (event) {
        var database = event.target.result
        var transaction = database.transaction([Type], 'readwrite')
        var objectStore = transaction.objectStore(Type)
        var objectRequest = objectStore.put(Data) // Overwrite if exists

        objectRequest.onerror = function (event) {
          reject(Error('Error during put transaction'))
        }

        objectRequest.onsuccess = function (event) {
          resolve(event.target.result)
        }
      }
    })
  },
  getAll (Type) {
    return new Promise((resolve, reject) => {
      var lreqDB = indexedDB.open('wlh')
      lreqDB.onerror = (event) => {
        reject(Error('IndexedDB database error'))
      }
      lreqDB.onupgradeneeded = (event) => {
        event.target.transaction.abort()
        reject(Error('Database not found'))
      }
      lreqDB.onsuccess = (event) => {
        const lobjDB = event.target.result

        const lobjRequest = lobjDB
          .transaction([Type])
          .objectStore(Type)
          .getAll()

        lobjRequest.onerror = function (event) {
          reject(Error('Error during get transaction'))
        }
        lobjRequest.onsuccess = function (event) {
          if (lobjRequest.result) {
            resolve(lobjRequest.result)
          } else {
            reject(
              Error('Data not found for getAll (Requesttype: ' + Type + ')')
            )
          }
        }
      }
    })
  },
  getRange (Type, Indices, KeyRange) {
    return new Promise((resolve, reject) => {
      var lreqDB = indexedDB.open('wlh')
      lreqDB.onerror = (event) => {
        reject(Error('IndexedDB database error'))
      }
      lreqDB.onupgradeneeded = (event) => {
        event.target.transaction.abort()
        reject(Error('Database not found'))
      }
      lreqDB.onsuccess = (event) => {
        const lobjDB = event.target.result

        try {
          const lobjRequest = lobjDB
            .transaction([Type])
            .objectStore(Type)
            .index(Indices)
            .get(IDBKeyRange.bound(KeyRange))

          lobjRequest.onerror = function (event) {
            reject(Error('Error during get transaction'))
          }
          lobjRequest.onsuccess = function (event) {
            if (lobjRequest.result) {
              resolve(lobjRequest.result)
            } else {
              reject(
                Error(
                  'Data not found for getAll (Requesttype: ' + Type + ')'
                )
              )
            }
          }
        } catch (ErrorObject) {
          switch (ErrorObject.name) {
            case 'NotFoundError':
              console.log('Dataset not found')
              resolve(false)
              break
            default:
              reject('Error: ' + ErrorObject)
              break
          }
        }
      }
    })
  },
  getMulti (Type, Where) {
    return new Promise((resolve, reject) => {
      var lreqDB = indexedDB.open('wlh')
      lreqDB.onerror = (event) => {
        reject(Error('IndexedDB database error'))
      }
      lreqDB.onupgradeneeded = (event) => {
        event.target.transaction.abort()
        reject(Error('Database not found'))
      }
      lreqDB.onsuccess = (event) => {
        const lobjDB = event.target.result

        const lobjRequest = lobjDB
          .transaction([Type])
          .objectStore(Type)
          .getAll()
        const LocalWhere = Where
        lobjRequest.onerror = function (event) {
          reject(Error('Error during get transaction'))
        }
        lobjRequest.onsuccess = function (event) {
          if (lobjRequest.result) {
            console.log(LocalWhere)
            const SearchWhere = LocalWhere
            // eslint-disable-next-line prefer-const
            let larrResult = []
            lobjRequest.result.forEach(Entry => {
              const larrKeys = Object.keys(SearchWhere)
              // eslint-disable-next-line no-unused-vars
              let lboolFound = false
              for (let lintKeyCounter = 0; lintKeyCounter < larrKeys.length; lintKeyCounter++) {
                if (Entry[larrKeys[lintKeyCounter]] === SearchWhere[larrKeys[lintKeyCounter]]) {
                  lboolFound = true
                } else {
                  lboolFound = false
                }
              }
              if (lboolFound) {
                larrResult.push(Entry)
              }
              console.log(Entry + SearchWhere)
            })
            resolve(larrResult)
          } else {
            reject(
              Error('Data not found for getAll (Requesttype: ' + Type + ')')
            )
          }
        }
      }
    })
  },
  get (Type, Where) {
    return new Promise((resolve, reject) => {
      var lreqDB = indexedDB.open('wlh')
      lreqDB.onerror = (event) => {
        reject(Error('IndexedDB database error'))
      }
      lreqDB.onupgradeneeded = (event) => {
        event.target.transaction.abort()
        reject(Error('Database not found'))
      }
      lreqDB.onsuccess = (event) => {
        const lobjDB = event.target.result

        const lobjRequest = lobjDB
          .transaction([Type])
          .objectStore(Type)
          .get(Where)

        lobjRequest.onerror = function (event) {
          reject(Error('Error during get transaction'))
        }
        lobjRequest.onsuccess = function (event) {
          if (lobjRequest.result) {
            resolve(lobjRequest.result)
          } else {
            reject(
              Error(
                'Data not found (Requesttype: ' +
                  Type +
                  ', Query: ' +
                  Where +
                  ')'
              )
            )
          }
        }
      }
    })
  }
}
