import Vue from 'vue'
// import { resolve, reject } from 'any-promise'
export default new Vue({
  data: {
    tabs: [],
    routerComponents: {},
    callback: [],
    notifyCallbak: []
  },
  watch: {
    tabs(val) {
      this.$nextTick(() => {
        for (const callback of this.callback) {
          callback(this.canKeepAlivePage())
        }
      })
    }
  },
  methods: {
    bindRouterView(componentName, routePath) {
      // if (!this.routerComponents[componentName]) {
      this.routerComponents[componentName] = routePath
      // }
    },
    close(path) {
      this.notify('close', path)
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 10)
      })
    },
    onKeepAliveChange(callback) {
      if (callback instanceof Function) {
        this.callback.push(callback)
      }
    },
    onNotify(callback) {
      if (callback instanceof Function) {
        this.notifyCallbak.push(callback)
      }
    },
    notify(type, params) {
      this.$nextTick(() => {
        for (const callback of this.notifyCallbak) {
          callback(type, params)
        }
      })
    },
    canKeepAlivePage() {
      const array = []
      for (const key in this.routerComponents) {
        const path = this.routerComponents[key]
        if (this.tabs.includes(path)) {
          array.push(key)
        }
      }
      return array
    }
  }
})
