import vue from 'vue'
import dialogComponent from './dialog'

import list from './list'
import edit from './edit'
import editChild from './edit/editChild'
import edit2 from './edit/edit2'
import eForm from './edit/editForm'
import relBind from './edit/relBind'
// 使用vue的extend，以vue文件为基础组件，返回一个可以创建vue组件的特殊构造函数
const DialogConstructor = vue.extend(dialogComponent)

function showDialog() {
  // const wrap = document.createElement('span')
  const component = arguments[0]
  const config = arguments[2] || arguments[1]
  let params = {}
  if (arguments.length > 2) {
    params = arguments[1]
  }
  const dialogDom = new DialogConstructor({
    el: 'span',
    data() {
      return {
        show: true,
        component,
        params,
        config: Object.assign({
          width: '900px',
          showFooter: true,
          title: '对话框',
          top: '20px'
        }, config)
      }
    },
    methods: {
      afterClose() {
        // this.$destroy(true)
        // this.$el.parentNode.removeChild(this.$el)
        // document.body.removeChild(dialogDom.$el)
      }
    }

  })
  // 在body中动态创建一个div元素，后面自动会把它替换成整个vue文件内的内容
  // document.body.appendChild(dialogDom.$el)
  // setTimeout(() => { dialogDom.show = false }, duration)
  return dialogDom
}

export function registryAdmin() {
  // 把showDialog这个方法添加到uve的原型中，可以直接调用，当调用的时候就是执行函数内的内容
  vue.prototype.$dialog = showDialog
  vue.component('edit', edit)
  vue.component('list', list)
  vue.component('edit2', edit2)
  vue.component('edit-child', editChild)
  vue.component('edit-form', eForm)
  vue.component('rel-bind', relBind)
}
