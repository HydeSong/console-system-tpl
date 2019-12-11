<template>
  <div class="lk-edit">
    <div v-if="showErrorMessage&&errorMessage&&errorMessage.length>0" style="padding:0px 20px 10px">
      <a-alert type="error" banner closable>
        <div slot="message" style="font-size:12px;">
          <div v-if="errorMessage.length>5">
            <span style="font-weight:500">{{ errorMessage.slice(0,5).join('、') }}</span>
            <span>&nbsp;等 {{ errorMessage.length }} 项表单数据填写有误</span>
          </div>
          <div v-else>
            <span style="font-weight:500">{{ errorMessage.join('、') }}</span>
            <span>&nbsp;填写有误</span>
          </div>
        </div>
      </a-alert>
    </div>
    <a-form refs="form" layout="inline" size="mini">
      <template v-for="(item, index) in displayEditFields">
        {{ initItemData(item) }}
        {{ bindRequiredValue(item,form) }}
        <a-form-item
          size="small"
          class="form-item"
          :key="item._key"
          :required="item.required"
          :validate-status="item.validateStatus"
          :label="showLabel(item)"
          :ref="item.prop"
          :labelCol="item.labelCol"
          :wrapperCol="item.wrapperCol"
          :class="[item.labelCol?'has-col':'']"
        >
          <!-- 当自定义组件的绑定属性为 000 时，则默认绑定根数据 -->
          <component
            :is="item.customView"
            v-if="item.customView&&item.prop==='0000'"
            :meta="item"
            :key="item._key+'custom'"
            :ref="item._key"
            :pvalue="form"
            :style="{width:item.width||'auto'}"
            @created="(val)=>{item.created?item.created(val):''}"
            @notify="val=>item.notify?item.notify(val):''"
            @change="val=>inputChange(val,item,form)"
            @validate="(val)=>{debugger}"
            v-model="form"
            :is-edit-item="true"
            :is-custom="true"
          />
          <component
            :is="item.customView"
            v-else-if="item.customView"
            :meta="item"
            :key="item._key+'custom'"
            :pvalue="form"
            :style="{width:item.width||'auto'}"
            @created="(val)=>{item.created?item.created(val):''}"
            @notify="val=>item.notify?item.notify(val):''"
            @change="(val)=>{validateItem(form[item.prop],item);if (item.change)item.change(val);}"
            v-model="form[item.prop]"
            :form="form"
            :is-edit-item="true"
            :is-custom="true"
            :ref="item._key"
          />
          <render-view
            v-else-if="item.type==='render'"
            :meta="item"
            :style="{width:item.width||'auto'}"
          />
          <a-checkbox
            v-else-if="item.type==='checkbox'&&!item.choice"
            v-model="form[item.prop]"
            :is-edit-item="true"
            :ref="item._key"
            :item="item"
          ></a-checkbox>
          <my-checkbox-group
            v-else-if="item.type==='checkbox'"
            v-model="form[item.prop]"
            @created="(val)=>{item.created?item.created(val):''}"
            @change="(val)=>{validateItem(form[item.prop],item);if (item.change)item.change(val);}"
            :is-edit-item="true"
            :ref="item._key"
            :item="item"
          >
            <!-- {{form[item.prop]}} -->
            <a-checkbox
              v-for="(itm, idx) in item.choice"
              :value="itm.value"
              :key="'ck'+idx"
            >{{ itm.label }}</a-checkbox>
          </my-checkbox-group>
          <a-select
            v-else-if="item.choice&& (typeof(item.choice)==='function')"
            v-model="form[item.prop]"
            :mode="item.multi?'multiple':undefined"
            :style="{width:dialogFormItemWidth}"
            @change="(val)=>{validateItem(form[item.prop],item);setFormSelectFormatterVal(item,val,choiceMap[item.prop])}"
            :is-edit-item="true"
            :ref="item._key"
            :item="item"
            allowClear
          >
            <a-select-option
              v-for="(c, index3) in choiceMap[item.prop]"
              :key="'f'+index3"
              :value="c.value"
            >{{ c.label }}</a-select-option>
          </a-select>
          <a-select
            v-else-if="item.choice"
            v-model="form[item.prop]"
            :mode="item.multi?'multiple':undefined"
            :style="{width:dialogFormItemWidth}"
            @change="val=>{validateItem(form[item.prop],item);}"
            :is-edit-item="true"
            :ref="item._key"
            :item="item"
            allowClear
          >
            <a-select-option v-for="(c) in item.choice" :key="c.value">{{ c.label }}</a-select-option>
          </a-select>
          <a-input-number
            v-else-if="item.type==='num'"
            v-model="form[item.prop]"
            :style="{width:dialogFormItemWidth}"
            :is-edit-item="true"
            :ref="item._key"
            :item="item"
          />
          <a-input-number
            v-else-if="item.type==='money'"
            v-model="form[item.prop]"
            :style="{width:dialogFormItemWidth}"
            :is-edit-item="true"
            :ref="item._key"
            :item="item"
            :min="0"
            :precision="2"
          />
          <myDatePicker
            v-else-if="item.type==='date'"
            type="date"
            format="YYYY-MM-DD"
            :style="{width:dialogFormItemWidth}"
            :readonly="item.readonly"
            v-model="form[item.prop]"
            @change="val=>inputChange(val,item,form)"
            :is-edit-item="true"
            :ref="item._key"
            :item="item"
          ></myDatePicker>
          <my-input-search
            v-else-if="item.component!==undefined"
            v-model="form[item.prop]"
            :show-value="form[item.showProp]"
            :placeholder="`请选择${item.label}`"
            maxlength="100"
            :readonly="item.readonly||readonly"
            :style="{width:dialogFormItemWidth}"
            :meta="item"
            :width="dialogFormItemWidth"
            @search="showProxyComponent3(item)"
            @change="val=>validateItem(form[item.prop],item)"
            :is-edit-item="true"
            :ref="item._key"
            :item="item"
          />
          <a-input-search
            v-else-if="item.component!==undefined"
            v-model="form[(item.showProp||item.prop)]"
            disabled
            :placeholder="`请选择${item.label}`"
            clearable
            maxlength="100"
            :style="{width:dialogFormItemWidth}"
            @search="showProxyComponent3(item)"
            @change="val=>validateItem(form[item.prop],item)"
            :is-edit-item="true"
            :ref="item._key"
            :item="item"
          >
            <a-button slot="enterButton" icon="ellipsis" />
          </a-input-search>
          <span v-else-if="item.type==='hidden'"></span>
          <a-textarea
            v-else-if="item.type==='textarea'"
            :style="{width:dialogFormItemWidth}"
            v-model="form[item.prop]"
            @change="(event)=>validateItem(form[item.prop],item)"
            :is-edit-item="true"
            :ref="item._key"
            :item="item"
          ></a-textarea>
          <edit-item
            v-else-if="item.type==='group'||item.type==='divide'"
            :item="item"
            v-model="form"
          >
            <template scope="scope">
              <span
                v-if="scope.show"
                :style="{width:item.noPanel?'auto':'100vh',display:item.noPanel?'':'table',border:item.noPanel||item.type==='divide'?'':'1px solid #e9e9e9',padding:item.noPanel?'':'0px 10px 10px',marginBottom:item.noPanel?'':'10px'}"
              >
                <!-- <a-divider v-if="!item.noPanel" orientation="left">{{scope.title}}</a-divider> -->
                <div
                  class="rp-title rp-title-before"
                  style="height: 16px;line-height: 16px;color:#333333;display: table;white-space: nowrap;margin:10px 10px 10px 0px"
                >
                  <span style="display:inline-block">{{ scope.title }}</span>
                  <!-- <span style="wdith:100%"></span> -->
                </div>
                <edit2
                  :key="scope.index"
                  :fields="scope.fields"
                  :form="scope.form"
                  :readonly="readonly"
                  :loop-find="true"
                  ref="edit2"
                />
              </span>
            </template>
          </edit-item>
          <a-input
            v-else
            v-model="form[item.prop]"
            :read-only="item.readonly"
            :style="{width:dialogFormItemWidth}"
            @change="(event)=>validateItem(form[item.prop],item)"
            :ref="item._key"
            :is-edit-item="true"
            :item="item"
          />
          <a-tooltip
            placement="right"
            style="position: absolute; right: -18px; top: 2px;z-index:1000"
            v-if="item.validateStatus==='error'"
          >
            <template slot="title">
              <span>{{ item.errorMessage }}</span>
            </template>
            <a-icon type="info-circle" style="margin-left:5px;color:red" />
          </a-tooltip>
        </a-form-item>
        <edit-child
          v-if="item.children||item.childrenProp"
          :item="item"
          :form="form"
          :key="'child'+index"
        />
      </template>
    </a-form>
    <!-- 表单按键组件代理 -->
    <a-modal
      v-model="proxyComponentDialog3.visible"
      width="800px"
      style="top:50px"
      class="admin-list-component"
      :title="proxyComponentDialog3.title||'对话框'"
      @ok="proxyComponentDialog3.onResult(proxyComponentDialog3.resultData);proxyComponentDialog3.visible=false"
    >
      <div v-if="proxyComponentDialog3.visible">
        <delay-show>
          <component
            ref="proxyComponent"
            :is="proxyComponentDialog3.component"
            :meta="proxyComponentDialog3.item"
            @onResult="(data)=>proxyComponentDialog3.resultData=data"
          />
        </delay-show>
      </div>
    </a-modal>
  </div>
</template>

<script>
import myCheckboxGroup from './myCheckBoxGroup'
import myDatePicker from './myDatePicker'
import myInputSearch from './myInputSearch'
import editItem from './editItem'
import renderView from './rander'
import delayShow from './DelayShow'
import validators from '../editValidators'
import { copyProps } from '../utils'
export default {
  components: { myCheckboxGroup, myDatePicker, editItem, renderView, myInputSearch, delayShow },
  name: 'Edit',
  componentName: 'Edit',
  props: {
    editFields: {
      type: Array,
      default() {
        return []
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    /**
     * 用于表单嵌套的场景
     */
    pvalue: {
      type: Object,
      default: null
    },
    form: {
      type: Object,
      default() {
        return null
      }
    },
    formItemWidth: {
      type: String,
      default: null
    },
    formLabelWidth: {
      type: Number,
      default: 160
    },
    showErrorMessage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vm = this
    return {
      formLayout: 'horizontal',
      choiceMap: {},
      mEditFields: [],
      formSelectFormatterVal: {},
      rules: [],
      // form: {},
      errorObj: null,
      // formObj: this.$form.createForm(this),
      proxyComponentDialog3: {
        visible: false,
        component: null,
        item: null,
        resultData: null,
        onResult(_data) {
          let data = _data
          if (!vm.$refs.proxyComponent.getComponentValue) {
            debugger
            throw new Error('请给代理组件实现 getComponentValue 方法')
          }
          const val = vm.$refs.proxyComponent.getComponentValue()
          if (val) {
            data = val
          }
          if (vm.proxyComponentDialog3.item.formatter) {
            const { label, value } = vm.proxyComponentDialog3.item.formatter(data)
            if (vm.proxyComponentDialog3.item.showProp) {
              vm.$set(vm.form, vm.proxyComponentDialog3.item.showProp, label)
              // vm.data[vm.proxyComponentDialog3.item.showProp] = label
            }
            // vm.data[vm.proxyComponentDialog3.item.prop] = value
            vm.$set(vm.form, vm.proxyComponentDialog3.item.prop, value)
            vm.validateItem(vm.form[vm.proxyComponentDialog3.item.prop], vm.proxyComponentDialog3.item)
          }
        }
      }
    }
  },
  created() {
    if (!this.form) {
      this.$emit('update:form', {})
    }
    if (this.editFields instanceof Function) {
      this.mEditFields = this.editFields()
    } else {
      console.warn('editFields 建议使用方法创建')
      this.mEditFields = Object.assign([], this.editFields)
    }
    this.mEditFields = this.mEditFields.map(item => copyProps({}, item))
    this.mEditFields.forEach(item => {
      if (item.choice) {
        if (item.choice instanceof Function) {
          // this.choiceMap[item.prop] = []
          this.$set(this.choiceMap, item.prop, [])
          item.choice().then(data => {
            this.$set(this.choiceMap, item.prop, data)
            // this.choiceMap[item.prop] = data
          })
        } else {
          this.choiceMap[item.prop] = item.choice
        }
      }
    })
    this.handleDefaultValue()
  },
  watch: {
    editFields: {
      deep: true,
      handler: function(val) {
        // 响应式更新表单item的属性(required, disabled)
        this.mEditFields = Object.assign([], val)
      }
    }
  },
  computed: {
    displayEditFields() {
      this.formatData()
      return (
        this.mEditFields
          // .map(item => copyProps({}, item))
          .filter(item => item && (!item.hidden || item.type === 'group'))
      )
    },
    dialogFormItemWidth() {
      if (this.formItemWidth) {
        return this.formItemWidth
      }
      return '180px'
    },

    errorMessage() {
      if (this.errorObj) {
        return this.errorObj.map(item => item.label)
      }
      return null
    }
  },
  methods: {
    inputChange(val, item, form) {
      console.log(val)
      this.validateItem(form[item.prop], item)
      if (item.change) item.change(val)
    },
    convertFormData() {
      this.mditFields.forEach(item => {
        if (item.choice && item.multi && this.form[item.prop]) {
          this.form[item.prop] = this.form[item.prop].split(',').map(item => {
            return parseInt(item)
          })
        }
      })
    },
    formatData() {
      this.mEditFields.forEach(item => {
        if (item.hidden === undefined) {
          // item.hidden = false
          this.$set(item, 'hidden', false)
        }
        let bindedItem = null
        if (item.type === 'group' && item.bind) {
          const bind = item.bind
          // item.titleMap = Object({}, item.titleMap)
          if (!item.titleMap) {
            item.titleMap = {}
          }
          for (const field of this.fields) {
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
          // debugger
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
              this.$set(this.form, bind.path, [])
              if (this.form[item.prop]) {
                this.form[item.prop].forEach(i => {
                  console.log(bind.path, bind.with)
                  this.form[bind.path].push(i[bind.with])
                })
              }
            }
          }
          // console.log('path:', this.form[bind.path])
        }
      })
    },
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

      // if (this.form[item.prop] === undefined) {
      //   debugger
      //   this.$set(this.form, item.prop, {})
      // }
    },
    // 去除多余view
    showLabel(column) {
      if (column.showLabel !== undefined && !column.showLabel) {
        return ''
      }
      if (column instanceof Object) {
        if (column.label) {
          return column.label
        }
      }
      // 处理属性为000时又未指定标题的情况
      if (column.prop === '0000') {
        return ''
      } else {
        return column.prop
      }
    },
    // 处理默认值，因为本系统有的值为Object，在录入的时候以list索引的方式进行记录
    // 所以这里要处理成list的索引
    handleDefaultValue() {
      this.formSelectFormatterVal = {}
      // this.editDialog.data = Object.assign({}, this.editDialog.data)
      this.mEditFields.forEach(item => {
        if (item.showValue) {
          this.formSelectFormatterVal[item.prop] = this.form[item.prop]
          this.form[item.prop] = item.showValue(this.form[item.prop])
        }
      })
    },
    setFormSelectFormatterVal(item, val, list) {
      if (item.acitonValue) {
        this.$set(this.formSelectFormatterVal, item.prop, item.acitonValue(val))
        // this.formSelectFormatterVal[item.prop] = item.acitonValue(val)
      } else {
        // this.formSelectFormatterVal[item.prop] = val
        this.$set(this.formSelectFormatterVal, item.prop, val)
      }
    },
    showProxyComponent3(item) {
      if (item.canNotPick) {
        this.$message.warning('当前不支持选择')
        return
      }
      this.proxyComponentDialog3.component = item.component
      this.proxyComponentDialog3.visible = true
      this.proxyComponentDialog3.item = item
      this.proxyComponentDialog3.title = item.label
    },
    getForm() {
      const form = Object.assign({}, this.form, this.formSelectFormatterVal)
      return form
    },
    bindRequiredValue(item, form) {
      const vm = this
      item.__getValue = function() {
        return form[item.prop]
        // }
      }
      item.__getView = function() {
        if (vm.$refs[item._key]) {
          return vm.$refs[item._key][0]
        }
      }
    },
    validateItemRule(value, item) {
      if (item.rules) {
        for (const rule of item.rules.split('|')) {
          let params = null
          const type = rule.replace(/\[(.*)\]/g, function() {
            // console.log(arguments[0])
            if (arguments[0]) {
              params = arguments[1].split(',')
            }
            // 查找数字后，可以对数字进行其他操作
            return ''
          })
          try {
            const res = validators.methods[type](value, params)
            if (!res) {
              if (validators.message[type]) {
                return this.msgFormat(validators.message[type], params)
              }
              return '未知'
            }
          } catch (error) {
            debugger
            return '未知异常'
          }
        }
      }
      return null
    },
    validateItem(value, item) {
      if (item.customView) {
        const view = item.__getView()
        if (view && view.validate instanceof Function) {
          if (view.validate()) {
            this.$set(item, 'validateStatus', 'success')
          } else {
            this.$set(item, 'validateStatus', 'error')
            this.$set(item, 'errorMessage', '输入有误')
          }
        } else {
          console.error('请在自定义组件中添加[validate]方法来返回是否通过验证！')
        }
      } else if (item.required && !value && !(typeof value === 'number' && value === 0)) {
        this.$set(item, 'validateStatus', 'error')
        this.$set(item, 'errorMessage', '不能为空')
      } else {
        // rules:'IDCard[12]|IDCard[12]'

        if (value && item.rules) {
          for (const rule of item.rules.split('|')) {
            let params = null
            const type = rule.replace(/\[(.*)\]/g, function() {
              // console.log(arguments[0])
              if (arguments[0]) {
                params = arguments[1].split(',')
              }
              // 查找数字后，可以对数字进行其他操作
              return ''
            })
            const res = validators.methods[type](value, params)
            if (!res) {
              this.$set(item, 'validateStatus', 'error')
              if (validators.message[type]) {
                this.$set(item, 'errorMessage', this.msgFormat(validators.message[type], params))
              } else {
                this.$set(item, 'errorMessage', null)
              }
              return
            }
          }
        }
        this.$set(item, 'validateStatus', 'success')
      }
    },
    msgFormat(msg, param) {
      if (param !== undefined && param instanceof Array) {
        param.forEach(function(value, index) {
          msg = msg.replace(new RegExp('\\{' + index + '\\}', 'g'), function() {
            return value
          })
        })
      }
      return msg
    },
    /**
     * 检查包含子节点的字段
     */
    checkChild(item, errors) {
      if (item.children && item.children.length > 0) {
        item.children.forEach(child => {
          if (item.__getValue) {
            const value = item.__getValue()
            this.validateItem(value, item)
            if (item.validateStatus === 'error') {
              errors.push({ label: item.label, prop: item.prop })
            }
          }

          const childFields = child.editFields
          if (childFields) {
            childFields.forEach(field => {
              const value = field.__getValue()
              this.validateItem(value, field)
              if (child.validateStatus === 'error') {
                errors.push({ label: field.label, prop: field.prop })
              }
              // this.checkChild(field, errors)
            })
          }
        })
      }
    },
    /**
     * 验证表单
     */
    validate() {
      // const vm = this
      this.errorObj = []
      const utils = require('../utils')
      const errors = []
      const items = utils.findByAttr(this, 'is-edit-item', 'loop-find')
      for (const item of items) {
        if (item.$attrs['is-custom']) {
          if (item.validate) {
            if (item.validate()) {
              this.$set(item.meta, 'validateStatus', 'success')
            } else {
              this.$set(item.meta, 'validateStatus', 'error')
              this.$set(item.meta, 'errorMessage', '输入有误')
              errors.push({ label: item.meta.label, prop: item.meta.prop })
            }
          }
        } else if (item.$attrs['is-edit-item'] && item.$attrs.item.prop !== '0000') {
          if (item.$attrs.item.required && item.value instanceof Array && item.value.length === 0) {
            this.$set(item.$attrs.item, 'validateStatus', 'error')
            this.$set(item.$attrs.item, 'errorMessage', '不能为空')
            errors.push({ label: item.label, prop: item.prop })
          } else if (
            item.$attrs.item.required &&
            !item.value &&
            !(typeof item.value === 'number' && item.value === 0)
          ) {
            this.$set(item.$attrs.item, 'validateStatus', 'error')
            this.$set(item.$attrs.item, 'errorMessage', '不能为空')
            errors.push({ label: item.$attrs.item.label, prop: item.$attrs.item.prop })
          } else {
            if (item.value) {
              const res = this.validateItemRule(item.value, item.$attrs.item)
              if (res) {
                this.$set(item.$attrs.item, 'validateStatus', 'error')
                errors.push({ label: item.$attrs.item.label, prop: item.$attrs.item.prop })
                this.$set(item.$attrs.item, 'errorMessage', res)
              } else {
                this.$set(item.$attrs.item, 'validateStatus', 'success')
              }
            }
          }
        }
      }

      if (errors.length > 0) {
        this.errorObj = errors
        document.body.scrollTop = document.documentElement.scrollTop = 0
        return Promise.reject(errors)
      } else {
        return Promise.resolve(this.form)
      }
    }
  }
}
</script>

<style  >
.lk-edit * {
  font-size: 12px;
}
.lk-edit .rp-title::before {
  content: '';
  display: table-cell;
  position: relative;
  top: 50%;
  width: 1%;
}
.lk-edit .rp-title::after {
  content: '';
  display: table-cell;
  position: relative;
  top: 50%;
  width: 99%;
}
.lk-edit .ant-form-item-label label {
  width: 148px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 12px;
  color: #666 !important;
}
.lk-edit .has-col .ant-form-item-label label {
  width: auto;
}
.lk-edit .ant-input {
  font-size: 12px;
}
.lk-edit .ant-input:disabled {
  color: #666;
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
.has-error .ant-form-split {
  color: #f5222d;
  display: none;
}
</style>
