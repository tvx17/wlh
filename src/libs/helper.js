export default {
  createText () {
    const fs = require('fs')
    const lmodPath = require('path')
    const lstrTextID = this.makeID('text')

    fs.writeFile(
      lmodPath.join('C:\\Users\\ckoeste1\\source\\repos\\P\\P\\wlh\\v1\\data', lstrTextID), 'No text in here', function (err) {
        if (err) {
          return console.log(err)
        }
        console.log('The file was saved!')
      }
    )
    return lstrTextID
  },
  makeID (Type) {
    switch (Type) {
      case 'text':
      case 't':
        return 't' + new Date().getTime().toString() + 'r' + this.getRndInteger(1000, 9999)
    }
  },
  getRndInteger (min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }
}
