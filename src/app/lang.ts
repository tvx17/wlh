import {i18n} from 'src/boot/i18n'
import {api} from 'boot/axios';
import {Dialog} from "quasar";


const loadData = async (path: string, name: string) => {
  const promise = new Promise((resolve, reject) => {
    path = `i18n/${path}/${name}.${i18n.global.locale.value}.json`;
    api.get(path).then((res) => {
      if (!i18n.global.messages.value[i18n.global.locale.value].hasOwnProperty(name)) {
        i18n.global.messages.value[i18n.global.locale.value][name] = res.data
      }

      if (!i18n.global.messages.value[i18n.global.locale.value].hasOwnProperty('loaded')) {
        i18n.global.messages.value[i18n.global.locale.value]['loaded'] = {}
      }
      i18n.global.messages.value[i18n.global.locale.value].loaded[name] = Date.now()
      cleanUp()
      console.log('Geladen')
    })
    resolve(true)
  })
  await promise
  return true
}

const cleanUp = () => {
  const removeAllBeforeObj = new Date()
  removeAllBeforeObj.setMinutes(removeAllBeforeObj.getMinutes() - 20)
  const removeAllBefore = removeAllBeforeObj.getTime()

  for (const langKey in i18n.global.messages.value[i18n.global.locale.value].loaded) {
    if (i18n.global.messages.value[i18n.global.locale.value].loaded[langKey] < removeAllBefore) {
      delete i18n.global.messages.value[i18n.global.locale.value][langKey]
      delete i18n.global.messages.value[i18n.global.locale.value].loaded[langKey]
    }
  }
}

const lang = {
  loadData
}

export default lang

export {lang, loadData}
