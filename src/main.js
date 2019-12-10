// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import Antd, { Modal } from 'ant-design-vue'

import '@/styles/ant-theme.less' // global css

import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
import './mock/index'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter
import './components/global.less'

// @ts-ignore
import { registryAdmin } from '@/components/admin'
// @ts-ignore
import tabState from '@/components/MultiTab/tabState'

Vue.config.productionTip = false

// antd默认值修改
const modal = Modal
modal.props.maskClosable = { type: Boolean, default: false }
modal.props.destroyOnClose = { type: Boolean, default: true }
// mount axios Vue.$http and this.$http
Vue.use(Antd, { size: 'small' })

Vue.use(VueAxios)

Vue.use(registryAdmin)

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')

/**
 * 打开新窗口
 * 会自动判断是否已打开，给出相应的提示操作。
 */
Vue.prototype.$open = function(path) {
  const vm = this
  const tabs = tabState.tabs
  const name = this.$router.match(path).name
  for (const tabUrl of tabs) {
    if (this.$router.match(tabUrl).name === name) {
      this.$confirm({
        title: '已存在功能相同的页面，是否重新打开?',
        content: '相同功能的页面只允许打开一个窗口，点击【确认】旧窗口页面数据变更会丢失，将被新窗页面口代替；点击【取消】会切换就窗口页面。',
        onOk() {
          tabState.close(tabUrl).then(() => {
            vm.$router.push(path)
          })
        },
        onCancel() {
          vm.$router.push(tabUrl)
        }
      })
      return
    }
  }
  this.$router.push(path)
}

/**
 * 关闭当前页面
 */
Vue.prototype.$finish = function() {
  tabState.notify('close', this.$route.path)
  // eslint-disable-next-line promise/param-names
  return new Promise((reslove, reject) => {
    this.$nextTick(() => {
      reslove()
    })
  })
}

/**
 *
 * @param vnode 获取可以关闭的父容器
 */
function getCloseableParent(vnode) {
  if (vnode.$parent.closable && vnode.$parent.close) {
    return vnode.$parent
  } else {
    return getCloseableParent(vnode.$parent)
  }
}

/**
 * 关闭父容器
 */
Vue.prototype.$close = function() {
  const component = getCloseableParent(this)
  if (component) {
    component.close()
  }
}

/**
 * 图片预览
 */
Vue.prototype.$pictures = function name(pictures) {
  const url = process.env.NODE_ENV.startsWith('dev')
    ? '/picture/index.html'
    : '/mmsweb/h5/picture/index.html'
  window.open(
    url +
      '?list=' +
      encodeURI(
        JSON.stringify(
          pictures.map(item => {
            item.name = encodeURI(item.name)
            return item
          })
        )
      )
  )
}

/**
 * 随机数
 */
Vue.prototype.$randomString = () => {
  return Math.random().toString(36).slice(-8)
}

function override(base, target) {
  const obj = {}

  for (const key in target) {
    if (base[key] === undefined) {
      console.warn(
        key + ':将被忽略，因为它不是应有参数。\n你或许需要的是这些：' + JSON.stringify(base)
      )
    }
  }

  for (const key in base) {
    if (key === 'override') {
      continue
    }
    if (target instanceof Object && target.hasOwnProperty(key)) {
      obj[key] = target[key]
    }
  }
  const result = Object.assign({}, base, obj)
  return result
}

Object.defineProperty(Vue.prototype, 'resultTable', {
  get: function() {
    if (!this.module) {
      throw new Error('请指定module属性')
    }
    if (!this.module.resultTable) {
      this.$set(this.module, 'resultTable', null)
    }

    return this.module.resultTable
  }
})
Vue.prototype.override = override
