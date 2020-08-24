<template>
  <section :class="padding100 ? 'app-main' : 'app-main-pad50'" class="bg">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      padding100: true
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  watch: {
    $route() {
      this.getRouter()
    }
  },
  created() {
    this.getRouter()
  },
  methods: {
    getRouter() {
      this.$route.path === '/dashboard' ? this.padding100 = false : this.padding100 = true
    }
  }
}
</script>

<style scoped>
.app-main {
  /*100 = navbar  */
  min-height: calc(100vh - 100px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 100px;
}
.app-main-pad50 {
  /*100 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #463F3A;
}
.fixed-header+.app-main-pad50 {
  padding-top: 50px;
}
/* .bg{ */
  /* background-color: #414345; */
/* } */
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
