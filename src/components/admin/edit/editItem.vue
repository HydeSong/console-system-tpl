<template>
  <div v-if="show">
    <!-- {{temp}} -->
    <!-- <a-divider orientation="left">11</a-divider> -->
    <!-- 22{{itemShow}}{{isCtrItemShow}} -->
    <div v-show="item.hidden===undefined||!item.hidden">
      <div v-if="item.prop==='0000'">
        <slot
          :fields="getFields(item.fields,0)"
          :title="item.title||item.label"
          :form="value"
          :show="!isCtrItemShow||itemShow[val[item.bind.with]]"
        />
      </div>
      <div v-else>
        <slot
          v-for="(val, index) in value[item.prop]"
          :value="val[item.bind.with]"
          :index="index"
          :fields="getFields(item.fields,index)"
          :title="item.titleMap[val[item.bind.with]+'']||title"
          :form="val"
          :show="!isCtrItemShow||itemShow[val[item.bind.with]]"
        />
      </div>
    </div>
  </div>
</template>

<script>
const utils = require('../utils/index')
export default {
  props: ['item', 'value', 'title'],

  data() {
    return {
      show: true,
      isCtrItemShow: false,
      itemShow: {},
      temp: { test: 'sd' }
    }
  },
  watch: {
    // 'value.issuerTypeCodes'() {
    //   debugger
    // }
  },

  methods: {
    getFields(fields, index) {
      if (fields === undefined) {
        return []
      }
      if (this.temp[index + '']) {
        return this.temp[index + '']
      }
      const newFields = []

      for (const field of fields) {
        const n = {}
        utils.copyProps(n, field, [])
        newFields.push(n)
      }
      this.$set(this.temp, index + '', newFields)
      // this.temp[index + ''] = newFields
      return newFields
    },
    handleArrayRelate(val) {
      if (!this.item.bind || !this.item.bind.path) {
        return
      }
      if (!val) {
        return
      }

      if (this.value[this.item.prop] === undefined) {
        this.$set(this.value, this.item.prop, [])
      }
      const valids = {}
      for (const item of val) {
        valids[item] = true // 默认所有的数据都不存在
      }
      // 保留已存在的数据
      this.value[this.item.prop] = this.value[this.item.prop].filter(item => {
        if (valids[item[this.item.bind.with]]) {
          delete valids[item[this.item.bind.with]] // 保留存在的数据，并且移除记录
          return true
        }
        return false
      })
      // 对于原本不存在的数据进行初始化
      for (const key in valids) {
        const newVal = Object.assign({}, this.item.default)
        newVal[this.item.bind.with] = key
        this.value[this.item.prop].push(newVal)
      }

      // console.log('设置', this.item.prop, this.value[this.item.prop])
    },
    handleOtherRelate(val) {
      /** 对于绑定了指定值的情况，如果与关联属性相同则显示，否则不显示 */
      if (this.item.bind && this.item.bind.eq) {
        if (val === this.item.bind.eq) {
          // this.item.hidden = false
          this.show = true
        } else {
          // this.item.hidden = true
          this.show = false
        }
      }
    },
    handleShowIn(val) {
      this.itemShow = {}
      if (val instanceof Array) {
        for (const i of val) {
          this.itemShow[i] = true
        }
      }
    },
    initRelateValue(val, prop) {
      if (this.item.prop === '0000') {
        this.handleOtherRelate(val)
      } else {
        this.handleArrayRelate(val)
      }
    }
  },

  created() {
    if (this.item.bind) {
      this.$watch('value.' + this.item.bind.path, val => this.initRelateValue(val, this.item.bind.path), {
        immediate: true
      })
      // 解析showIn指令
      if (this.item.bind.showIn !== undefined) {
        this.isCtrItemShow = true
        this.$set(this.value, this.item.bind.showIn, null)
        this.$watch('value.' + this.item.bind.showIn, val => this.handleShowIn(val, this.item.bind.showIn))
      }
    }
  }
}
</script>

<style>
</style>
