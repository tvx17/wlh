export default {
  async init (VueInstance) {
    VueInstance.$l.init()
    if (localStorage.getItem('wlh_db_setup') === null) {
      await VueInstance.$d.init()
    }
  }
}
