import { api } from 'boot/axios';
import constants from 'src/app/constants';
import { i18n as i18nReference } from 'src/boot/i18n';


const loadData = async (path: string, name: string) => {
  const promise = new Promise((resolve, reject) => {
    const locale = i18nReference.global.locale.value;
    const messages = i18nReference.global.messages.value[locale];

    if (messages.hasOwnProperty(path) && messages[path].hasOwnProperty(name)) {
      resolve(true);
    }

    if (constants.app.appRunMode === 'desktop') {
      const filePath = `i18n/${path}/${name}.${i18nReference.global.locale.value}.json`;
      api.get(filePath).then((res) => {
        if(!messages.hasOwnProperty(path)) {
          messages[path] = {};
          messages[path][name] = res.data;
        }
        if(messages.hasOwnProperty(path) && !messages[path].hasOwnProperty(name)) {
          messages[path][name] = res.data;
        }
        if (!messages.hasOwnProperty('loaded')) {
          messages['loaded'] = {};
        }
        messages.loaded[name] = Date.now();
        cleanUp();
      });
    }
    resolve(true);


    /*path = `i18n/${path}/${name}.${i18nReference.global.locale.value}.json`;
     api.get(path).then((res) => {
     if (!i18nReference.global.messages.value[i18nReference.global.locale.value].hasOwnProperty(name)) {
     i18nReference.global.messages.value[i18nReference.global.locale.value][name] = res.data
     }

     if (!i18nReference.global.messages.value[i18nReference.global.locale.value].hasOwnProperty('loaded')) {
     i18nReference.global.messages.value[i18nReference.global.locale.value]['loaded'] = {}
     }
     i18nReference.global.messages.value[i18nReference.global.locale.value].loaded[name] = Date.now()
     cleanUp()
     })
     resolve(true)*/
  });
  await promise;
  return true;
};

const cleanUp = () => {
  const locale = i18nReference.global.locale.value;
  const messages = i18nReference.global.messages.value[locale];
  const removeAllBeforeObj = new Date();
  removeAllBeforeObj.setMinutes(removeAllBeforeObj.getMinutes() - 20);
  const removeAllBefore = removeAllBeforeObj.getTime();

  for (const langKey in messages.loaded) {
    if (messages.loaded[langKey] < removeAllBefore) {
      delete messages[langKey];
      delete messages.loaded[langKey];
    }
  }
};

function get(folder: string, file: string, key: string) {
  // Not yet implemented
}

const i18n = {
  loadData, get
};

export default i18n;

export { i18n, loadData, get };
