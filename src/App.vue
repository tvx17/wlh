<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  beforeCreate () {
    this.$app.init(this)
  },
  mounted () {
    if (localStorage.getItem('whl_app_configured') === null) {
      this.$router.push({ path: '/setup' })
    }
  }
}
</script>
