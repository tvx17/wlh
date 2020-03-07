export default {
  _ (Key, Component) {
    const lstrKey = 'wlh_lang_' + Component.toLowerCase() + '_' + Key.toLowerCase()
    if (localStorage.getItem(lstrKey) !== null) {
      return localStorage.getItem(lstrKey)
    } else {
      return 'Missing translation for key \'' + Key + '\' in component \'' + Component + '\''
    }
  },
  init () {
    if (localStorage.getItem('lang') === null) {
      const lstrLang = this.getSystemLanguage()
      this.loadLanguageData(lstrLang)
    }
  },
  getSystemLanguage () {
    const lobjFS = require('fs')
    const lstrLang = navigator.language

    // Check if the system language is available.
    if (lobjFS.existsSync('C:\\Users\\ckoeste1\\source\\repos\\P\\P\\wlh\\v1\\src\\i18n\\' + lstrLang)) {
      localStorage.setItem('wlh_lang', lstrLang)
    } else {
      localStorage.setItem('wlh_lang', 'en')
    }

    return lstrLang
  },
  loadLanguageData (Language) {
    const lobjFS = require('fs')
    const lobjJSON = require('load-json-file')
    lobjFS.readdirSync('C:\\Users\\ckoeste1\\source\\repos\\P\\P\\wlh\\v1\\src\\i18n\\' + Language).forEach(lstrFile => {
      const lobjJSONData = lobjJSON.sync('C:\\Users\\ckoeste1\\source\\repos\\P\\P\\wlh\\v1\\src\\i18n\\' + Language + '\\' + lstrFile)
      lstrFile = lstrFile.substring(0, lstrFile.indexOf('.'))
      const larrKeys = Object.keys(lobjJSONData)
      for (let lintCounter = 0; lintCounter < larrKeys.length; lintCounter++) {
        localStorage.setItem('wlh_lang_' + lstrFile + '_' + larrKeys[lintCounter], lobjJSONData[larrKeys[lintCounter]])
      }
    })
  }
}
