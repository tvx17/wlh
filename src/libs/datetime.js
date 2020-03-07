export default {
  dtID () {
    const ldtNow = new Date()
    return this.checkLength(ldtNow.getDate(), 'day') + this.checkLength(ldtNow.getMonth(), 'month') + ldtNow.getFullYear() + this.checkLength(ldtNow.getHours(), 'hour') + this.checkLength(ldtNow.getMinutes(), 'minute') + this.checkLength(ldtNow.getSeconds(), 'second') + this.checkLength(ldtNow.getMilliseconds(), 'milli')
  },
  checkLength (Value, Type) {
    switch (Type) {
      case 'day':
      case 'month':
      case 'minute':
      case 'hour':
      case 'second':
      case 'milli':
        if (Value < 10) {
          return '0' + Value.toString()
        } else {
          return Value.toString()
        }
    }
  }
}
