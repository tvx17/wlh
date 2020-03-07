let DB
let gobjRequest = window.indexedDB.open('wlh')

gobjRequest.onupgradeneeded = Event => {
  DB = Event.target.result
  DB.createObjectStore('structure', { keyPath: 'id' })
  DB.createObjectStore('texts', { keyPath: 'id' })
}
gobjRequest.onsuccess = Event => {
  DB = gobjRequest.result
}

export default DB
