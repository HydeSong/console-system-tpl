import validators from '../editValidators'
import Vue from 'vue'
const vue = new Vue()
/**
 *
 * @param {*} souce
 * @param {*} target
 * @param {*} exclude
 */
export function copyProps(souce, target, exclude = []) {
  for (const key in target) {
    if (!exclude.includes(key)) {
      const element = target[key]
      souce[key] = element
    }
  }
  return souce
}

export function findParents(vnode, tag) {
  debugger
}

/**
 * 根据属性值搜索节点
 * @param {*} vnode
 * @param {*} trueOfAttr 节点属性为true
 * @param {*} loopAttr 循环查找的节点
 */
export function findByAttr(vnode, trueOfAttr, loopNodeAttr) {
  const items = []
  _findByAttr(vnode, trueOfAttr, loopNodeAttr, items)
  return items
}
function _findByAttr(vnode, trueOfAttr, loopNodeAttr, items) {
  // const items = []
  for (const key in vnode.$refs) {
    if (vnode.$refs.hasOwnProperty(key)) {
      const element = vnode.$refs[key]
      if (!element) {
        continue
      }
      //
      if (element instanceof Array) {
        element.forEach(item => {
          if (item.$attrs && item.$attrs[trueOfAttr]) {
            // console.log(item.$attrs.item.label)
            items.push(item)
          }
          if (item.$attrs && item.$attrs[loopNodeAttr]) {
            _findByAttr(item, trueOfAttr, loopNodeAttr, items)
          }
        })
      } else if (element.$attrs && element.$attrs[trueOfAttr]) {
        items.push(element)
      } else if (element.$attrs && element.$attrs[loopNodeAttr]) {
        _findByAttr(element, trueOfAttr, loopNodeAttr, items)
      }
    }
  }
  return items
}

function validateItemRule(value, item) {
  if (item.rules) {
    for (const rule of item.rules.split('|')) {
      let params = null
      const type = rule.replace(/\[(.*)\]/g, function () {
        // console.log(arguments[0])
        if (arguments[0]) {
          params = arguments[1].split(',')
        }
        // 查找数字后，可以对数字进行其他操作
        return ''
      })
      const res = validators.methods[type](value, params)
      if (!res) {
        if (validators.message[type]) {
          return msgFormat(validators.message[type], params)
        }
        return '未知'
      }
    }
  }
  return null
}

const msgFormat = function (msg, param) {
  if (param !== undefined && param instanceof Array) {
    param.forEach(function (value, index) {
      msg = msg.replace(new RegExp('\\{' + index + '\\}', 'g'), function () {
        return value
      })
    })
  }
  return msg
}

/**
 * 检查表单组件
 * @param {*} items component实例，带有value属性
 */
export function checkFormItems(items) {
  const errors = []

  for (const item of items) {
    if (item.$attrs['is-custom']) {
      if (item.validate) {
        if (item.validate()) {
          vue.$set(item.$attrs.meta || item.meta, 'validateStatus', 'success')
        } else {
          vue.$set(item.$attrs.meta || item.meta, 'validateStatus', 'error')
          const meta = item.$attrs.meta || item.meta
          errors.push({ label: meta.label, prop: meta.prop })
          vue.$set(meta, 'errorMessage', '输入有误')
        }
      }
    } else if (item.$attrs['is-edit-item'] && item.$attrs.item.prop !== '0000') {
      if (item.$attrs.item.required && item.value instanceof Array && item.value.length === 0) {
        vue.$set(item.$attrs.item, 'validateStatus', 'error')
        vue.$set(item.$attrs.item, 'errorMessage', '不能为空')
        errors.push({ label: item.label, prop: item.prop })
      } else if (item.$attrs.item.required && !item.value) {
        vue.$set(item.$attrs.item, 'validateStatus', 'error')
        vue.$set(item.$attrs.item, 'errorMessage', '不能为空')
        errors.push({ label: item.$attrs.item.label, prop: item.$attrs.item.prop })
      } else {
        if (item.value) {
          const res = validateItemRule(item.value, item.$attrs.item)
          if (res) {
            vue.$set(item.$attrs.item, 'validateStatus', 'error')
            errors.push({ label: item.$attrs.item.label, prop: item.$attrs.item.prop })
            vue.$set(item.$attrs.item, 'errorMessage', res)
          } else {
            vue.$set(item.$attrs.item, 'validateStatus', 'success')
          }
        }
      }
    }
  }
  return errors
}
