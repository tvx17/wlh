export default {
  async _ (Key, Component) {
    /* eslint-disable no-unused-vars */
    return new Promise((resolve, reject) => {
      let lobjRequest = window.indexedDB.open('wlh', 1)
      lobjRequest.onerror = lobjEvent => {
        console.log(lobjEvent)
      }
      lobjRequest.onsuccess = lobjEvent => {
        resolve(Key, Component, lobjEvent)
      }
    })
  },
  async read (Key, Component, Event) {
    return new Promise((resolve, reject) => {
      let lobjDB = Event.target.result
      let lobjTransaction = lobjDB.transaction('language', 'readwrite')
      let lobjObjectStore = lobjTransaction.objectStore('language')
      let lobjGetRequest = lobjObjectStore.get([Key, Component])

      lobjGetRequest.onerror = lobjEvent => {
        console.log('Error during request execution')
      }

      lobjGetRequest.onsuccess = lobjEvent => {
        if (lobjGetRequest.result) {
          resolve(lobjGetRequest.result.value)
        } else {
          console.log('Not found')
        }
      }
    })
  }
}
