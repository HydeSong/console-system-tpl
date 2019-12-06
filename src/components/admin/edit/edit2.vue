<template>
  <div class="lk-edit lk-edit2">
    <div v-if="showErrorMessage&&errorMessage&&errorMessage.length>0" style="padding:0px 20px 10px">
      <a-alert type="error" banner closable>
        <div slot="message" style="font-size:12px;">
          <div v-if="errorMessage.length>5">
            <span style="font-weight:500">{{errorMessage.slice(0,5).join('、')}}</span>
            <span>&nbsp;等{{errorMessage.length}}项表单数据填写有误</span>
          </div>
          <div v-else>
            <span style="font-weight:500">{{errorMessage.join('、')}}</span>
            <span>&nbsp;填写有误</span>
          </div>
        </div>
      </a-alert>
    </div>
    <a-form layout="inline" ref="form">
      <a-form-item
        v-for="(item, index) in displayFields"
        :label="item.showLabel&&item.show?item.label:''"
        :key="index"
        :required="item.required&&!readonly"
        :validate-status="item.validateStatus"
        :ref="item.prop"
        :labelCol="item.labelCol"
        :wrapperCol="item.wrapperCol"
        :class="[item.labelCol?'has-col':'']"
      >
        <!-- {{initItemData(item)}} -->
        <!-- {{bindRequiredValue(item,form)}} -->
        <edit-form-view
          :form="form"
          :itemWidth="item.width||dialogFormItemWidth"
          :item="item"
          :title="title"
          :readonly="item.readonly||readonly"
          :loop-find="true"
          @bind-change="data=>bindChange(data,item)"
          ref="editFormView"
        />
        <a-tooltip
          placement="right"
          style="position: absolute; right: -18px; top: 2px;z-index:1000"
          v-if="item.show&&item.type!=='checkbox'&&!item.customView&&item.validateStatus==='error'"
        >
          <template slot="title">
            <span>{{item.errorMessage}}</span>
          </template>
          <a-icon type="info-circle" style="margin-left:5px;color:red" />
        </a-tooltip>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import myCheckboxGroup from './myCheckBoxGroup'
import myInputSearch from './myInputSearch'
import editItem from './editItem'
import editFormView from './editFormView'
import { copyProps } from '../utils'

// import validators from '../editValidators'

export default {
  props: {
    title: String,
    fields: { type: Array, default: () => [] },
    form: { type: Object, default: () => {} },
    readonly: { type: Boolean, default: false },
    showErrorMessage: {
      type: Boolean,
      default: false
    },
    formItemWidth: {
      type: String,
      default: null
    }
  },
  components: { myCheckboxGroup, myInputSearch, editItem, editFormView },
  name: 'edit2',
  componentName: 'edit2',
  data() {
    // const vm = this
    return {
      mFields: [],
      errorObj: []
    }
  },
  computed: {
    displayFields() {
      this.initFormData(this.mFields)
      return this.mFields.filter(item => item && (!item.hidden || item.type === 'group'))
    },
    dialogFormItemWidth() {
      if (this.formItemWidth) {
        return this.formItemWidth
      }
      // if (this.editFields && this.editFields.length < 10) {
      //   return '496px'
      // }
      return '180px'
    },
    errorMessage() {
      if (this.errorObj) {
        return this.errorObj.map(item => item.label)
      }
      return null
    }
  },
  watch: {
    fields() {}
  },
  created() {
    this.mFields = this.fields.map(item => {
      const newItem = copyProps({ show: true, showLabel: true }, item)
      return newItem
    })
  },
  methods: {
    // 绑定回调处理
    bindChange(data, item) {
      if (data.type === 'visible') {
        // item.show = data.value
        this.$set(item, 'show', data.value)
      } else if (data.type === 'value') {
        this.$set(this.form, item.prop, data.value)
      } else if (data.type === 'tovalue') {
        // 反向映射
        this.$set(this.form, data.target, data.value)
      }
    },
    /**
     * 对数据进行初始化
     */
    initFormData(fields) {
      fields.forEach(item => {
        if (item.hidden === undefined) {
          // item.hidden = false
          this.$set(item, 'hidden', false)
        }
        // this.initItemData(item)
        let bindedItem = null
        if (item.type === 'group' && item.bind) {
          const bind = item.bind
          // item.titleMap = Object({}, item.titleMap)
          if (!item.titleMap) {
            item.titleMap = {}
          }
          // 遍历关联选项的label用来显示panel的标题
          for (const field of fields) {
            if (field.prop === bind.path) {
              bindedItem = field
              if (field.choice) {
                field.choice.forEach(option => {
                  item.titleMap[option.value + ''] = option.label
                })
                break
              }
            }
          }
          // bind: { path: 'issuerTypeCodes', with: 'issuerTypeCode' },
          /**
           * 处理有关联配置的item
           */
          // 如果都不为 undefined 检查是否一致
          // if (bind.with&&this.form[item.prop] !== undefined && this.form[bind.path] !== undefined) {
          //     this.form[item.prop].join(',')===this.form[bind.path].map(item=>item[bind.with]).join(',')
          // }
          if (this.form[bind.path] === undefined && bindedItem && bind.path && bind.with) {
            if (bindedItem.type === 'radio') {
              // 如果分组的子节点作用于父节点，取分组的第一个为绑定数据
              let data = this.form[item.prop]
              if (item.prop === '0000' && item.fields) {
                data = this.form[item.fields[0].prop]
              }
              // 如果被关联节点是单选，结果是数组，取第一条中的关联字段值
              if (data instanceof Array && data.length > 0) {
                // this.form[bind.path] = data[0][bind.with]
                this.$set(this.form, bind.path, data[0][bind.with])
              } else if (data instanceof Object && data[bind.with] !== undefined) {
                // 如果是对象，直接取值
                // this.form[bind.path] = data[bind.with]
                this.$set(this.form, bind.path, data[bind.with])
              }
            } else if (bindedItem.choice !== undefined) {
              if (this.form[item.prop]) {
                // 如果表单数据存在被关联数据，则反向同步
                this.$set(this.form, bind.path, [])
                this.form[item.prop].forEach(i => {
                  console.log(bind.path, bind.with)
                  this.form[bind.path].push(i[bind.with])
                })
              } else {
                // 如果表单数据不存在被关联数据,不赋值，数据初始化将交给item自己处理（editItem> const newVal = Object.assign({}, this.item.default)）
              }
            }
          }
          // console.log('path:', this.form[bind.path])
        }
      })
      // 对于上个步骤未进行数据还原的数据，进行默认值处理
      fields.forEach(item => {
        this.initItemData(item)
      })
    },
    setForm(data) {},
    random() {
      const propName = Math.random()
        .toString(36)
        .slice(-8)
      return propName
    },
    initItemData(item) {
      if (!item._key) {
        item._key = this.random()
      }

      if (item.init) {
        item.init(this.form[item.prop])
      }

      // 赋值默认值
      if (this.form[item.prop] === undefined && item.default !== undefined) {
        this.$set(this.form, item.prop, item.default)
      }
    },
    bindRequiredValue(item, form) {
      // item.__getValue = function() {
      //   return form[item.prop]
      // }
      // const vm = this
      // item.__getView = function() {
      //   if (vm.$refs[item._key]) {
      //     return vm.$refs[item._key][0]
      //   }
      // }
      // 设置默认值
      // if (item.prop === 'transTypeCodes') {
      //   debugger
      // }
    },

    /**
     * 验证表单
     */
    validate() {
      // const vm = this
      this.errorObj = []
      const utils = require('../utils')
      const items = utils.findByAttr(this, 'is-edit-item', 'loop-find')
      const errors = utils.checkFormItems(items)
      if (errors.length > 0) {
        this.errorObj = errors
        // document.body.scrollTop = document.documentElement.scrollTop = 0
        return Promise.reject(errors)
      } else {
        return Promise.resolve(this.form)
      }
    }
  }
}
</script>

<style >
.lk-edit * {
  font-size: 12px;
}
.lk-edit2 .ant-form-item-label label {
  width: 95px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 12px;
  color: #666 !important;
}
.lk-edit2 .has-col .ant-form-item-label label {
  width: auto;
}

.lk-edit .ant-input {
  font-size: 12px;
}
.lk-edit .has-error .ant-checkbox-inner {
  border-color: #f5222d;
}
.lk-edit .ant-select-disabled {
  color: #666;
}
.lk-edit .ant-select-selection-selected-value {
  font-size: 12px;
}
.lk-edit .ant-divider-horizontal.ant-divider-with-text,
.ant-divider-horizontal.ant-divider-with-text-left,
.ant-divider-horizontal.ant-divider-with-text-right {
  font-size: 14px !important;
}
.lk-edit .has-error .ant-form-explain,
.has-error .ant-form-split {
  color: #f5222d;
  display: none;
}
</style>
