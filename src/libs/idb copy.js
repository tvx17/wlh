export default {
  db_config (DB) {
    const lobjFS = require('fs')
    const lstrLang = navigator.language
    let lobjObjectStore = DB.createObjectStore('config', { keyPath: 'key' })

    lobjObjectStore.createIndex('key', 'key', { unique: true })

    // Check if the system language is available.
    if (lobjFS.existsSync('C:\\Users\\ckoeste1\\source\\repos\\P\\P\\wlh\\v1\\src\\i18n\\' + lstrLang)) {
      lobjObjectStore.add({ key: 'language', value: lstrLang })
    } else {
      lobjObjectStore.add({ key: 'language', value: 'en' })
    }

    return lstrLang
  },
  db_language (DB, Language) {
    let lobjObjectStore = DB.createObjectStore('language', { keyPath: ['key', 'component'] })
    lobjObjectStore.createIndex('key', 'key', { unique: false })
    lobjObjectStore.createIndex('component', 'component', { unique: false })

    const lobjFS = require('fs')
    const lobjJSON = require('load-json-file')
    lobjFS.readdirSync('C:\\Users\\ckoeste1\\source\\repos\\P\\P\\wlh\\v1\\src\\i18n\\' + Language).forEach(lstrFile => {
      console.log(lstrFile)
      let lobjJSONData = lobjJSON.sync('C:\\Users\\ckoeste1\\source\\repos\\P\\P\\wlh\\v1\\src\\i18n\\' + Language + '\\' + lstrFile)
      lstrFile = lstrFile.substring(0, lstrFile.indexOf('.'))
      let larrKeys = Object.keys(lobjJSONData)
      for (let lintCounter = 0; lintCounter < larrKeys.length; lintCounter++) {
        console.log({ component: lstrFile, key: larrKeys[lintCounter], value: lobjJSONData[larrKeys[lintCounter]] })
        lobjObjectStore.add({ component: lstrFile, key: larrKeys[lintCounter], value: lobjJSONData[larrKeys[lintCounter]] })
      }
      console.log(lobjJSONData)
    })
  },
  init () {
    let lobjRequest = window.indexedDB.open('wlh', 1)
    lobjRequest.onerror = lobjEvent => {
      console.log('Error: Cannot open database')
    }
    lobjRequest.onupgradeneeded = lobjEvent => {
      let lstrLanguage = this.db_config(event.target.result)
      this.db_language(event.target.result, lstrLanguage)
    }
  }
}
