<template>
  <span v-if="form&&show" class="edit-form-view">
    <component
      :is="item.customView"
      v-if="item.customView&&item.prop==='0000'"
      :meta="item"
      :key="item._key+'custom'"
      :pvalue="form"
      :readonly="readonly"
      :ref="item._key"
      :style="{width:item.width||itemWidth}"
      @created="(val)=>{item.created?item.created(val):''}"
      @notify="val=>item.notify?item.notify(val):''"
      @change="(val)=>{if (item.change)item.change(val);}"
      v-model="form"
      :is-edit-item="true"
      :is-custom="true"
      :title="title"
    />
    <component
      :is="item.customView"
      v-else-if="item.customView"
      :meta="item"
      :key="item._key+'custom'"
      :ref="item._key"
      :pvalue="form"
      :readonly="readonly"
      :style="{width:item.width||itemWidth}"
      :width="item.width||itemWidth"
      @created="(val)=>{item.created?item.created(val):''}"
      @notify="val=>item.notify?item.notify(val):''"
      @change="(val)=>{validateItem(form[item.prop],item);if (item.change)item.change(val);}"
      v-model="form[item.prop]"
      :form="form"
      :is-edit-item="true"
      :is-custom="true"
      :title="title"
    />
    <render-view v-else-if="item.type==='render'" :meta="item" :style="{width:item.width||'auto'}" />
    <a-checkbox-group
      v-else-if="item.type==='checkbox'&&readonly"
      :readonly="readonly"
      :ref="item._key"
      :value="form[item.prop]"
      :options="item.choice"
      :is-edit-item="true"
      :item="item"
      :style="{width:itemWidth}"
      @change="(val)=>{validateItem(form[item.prop],item);if (item.change)item.change(val);}"
    />
    <a-checkbox
      v-else-if="item.type==='checkbox'&&!item.choice"
      :checked="form[item.prop]"
      @change="e=> $set(form,item.prop,e.target.checked)"
      :is-edit-item="true"
      :ref="item._key"
      :item="item"
      :style="{width:item.width||itemWidth}"
    >{{item.name}}</a-checkbox>
    <my-checkbox-group
      v-else-if="item.type==='checkbox'"
      v-model="form[item.prop]"
      :ref="item._key"
      :options="item.choice"
      :is-edit-item="true"
      :item="item"
      @change="(val)=>{validateItem(form[item.prop],item);if (item.change)item.change(val);}"
    >
      <a-checkbox
        v-for="(item, index) in item.choice"
        :value="item.value"
        :key="'ck'+index"
      >{{item.label}}</a-checkbox>
    </my-checkbox-group>
    <a-radio-group
      v-else-if="item.type==='radio'&&!readonly"
      :ref="item._key"
      :options="item.choice"
      v-model="form[item.prop]"
      :is-edit-item="true"
      :item="item"
      :disabled="readonly"
      :style="{width:item.width||itemWidth}"
    />
    <a-radio-group
      v-else-if="item.type==='radio'"
      :options="item.choice"
      :value="form[item.prop]"
      :is-edit-item="true"
      :item="item"
    />
    <a-select
      v-else-if="item.choice&& (typeof(item.choice)==='function')"
      :ref="item._key"
      v-model="form[item.prop]"
      :multiple="item.multi"
      :style="{width:itemWidth}"
      :is-edit-item="true"
      :item="item"
      allowClear
      @change="(val)=>{validateItem(form[item.prop],item);}"
    >
      <a-select-option
        v-for="(c, index3) in choiceData"
        :key="'f'+index3"
        :value="c.value"
      >{{ c.label }}</a-select-option>
    </a-select>
    <a-select
      v-else-if="item.choice"
      v-model="form[item.prop]"
      :ref="item._key"
      :readonly="readonly"
      :disabled="readonly"
      :style="{width:itemWidth}"
      :is-edit-item="true"
      :item="item"
      :mode="item.multi?'multiple':undefined"
      showSearch
      allowClear
      @change="(val)=>{validateItem(form[item.prop],item);}"
      :filterOption="selectFilterOption"
    >
      <a-select-option v-for="c in item.choice" :key="c.value">{{ c.label }}</a-select-option>
    </a-select>
    <a-input-number
      v-else-if="item.type==='num'&&!readonly"
      :ref="item._key"
      :readonly="readonly"
      v-model="form[item.prop]"
      :is-edit-item="true"
      :item="item"
      :style="{width:itemWidth}"
      @change="(val)=>{validateItem(form[item.prop],item);}"
    />
    <a-input-number
      v-else-if="item.type==='money'&&!readonly"
      :ref="item._key"
      :readonly="readonly"
      v-model="form[item.prop]"
      :is-edit-item="true"
      :item="item"
      :style="{width:itemWidth}"
      @change="(val)=>{validateItem(form[item.prop],item);}"
      :min="0"
      :precision="2"
    />
    <my-input-search
      v-else-if="item.component!==undefined"
      v-model="form[item.prop]"
      :show-value="form[item.showProp]"
      :placeholder="`请选择${item.label}`"
      maxlength="100"
      :readonly="item.readonly||readonly"
      :style="{width:item.width||itemWidth}"
      :meta="item"
      :width="itemWidth"
      @search="showProxyComponent3(item)"
      @change="val=>validateItem(form[item.prop],item)"
      :is-edit-item="true"
      :ref="item._key"
      :item="item"
    />
    <a-input-search
      v-else-if="item.component!==undefined"
      v-model="form[(item.showProp||item.prop)]"
      :ref="item._key"
      disabled
      :placeholder="readonly===undefined||!readonly?'请选择':'无'"
      clearable
      maxlength="100"
      :is-edit-item="true"
      :item="item"
      :style="{width:itemWidth}"
      @search="showProxyComponent3(item)"
      @change="(val)=>{validateItem(form[item.prop],item);}"
    >
      <a-button slot="enterButton" icon="ellipsis" v-if="readonly===undefined||!readonly" />
      <span v-else slot="enterButton"></span>
    </a-input-search>
    <span v-else-if="item.type==='hidden'"></span>
    <a-textarea
      v-else-if="item.type==='textarea'"
      :style="{width:itemWidth}"
      v-model="form[item.prop]"
      @change="(event)=>validateItem(form[item.prop],item)"
      :is-edit-item="true"
      :ref="item._key"
      :item="item"
    ></a-textarea>
    <edit-item v-else-if="item.type==='group'||item.type==='divide'" :item="item" v-model="form">
      <template scope="scope">
        <!-- show:{{scope.show}} -->
        <!-- {{scope.fields}} -->
        <span
          v-if="scope.show"
          :style="{width:item.noPanel?'auto':'100%',display:item.noPanel?'':'table',border:item.noPanel?'':'1px solid #e9e9e9',padding:item.noPanel||item.type==='divide'?'':'0px 10px 10px',marginBottom:item.noPanel?'':'10px'}"
        >
          <!-- <a-divider v-if="!item.noPanel" orientation="left">{{scope.title}}</a-divider> -->
          <div
            v-if="!item.noPanel"
            class="rp-title rp-title-before"
            style="height: 16px;line-height: 16px;color:#333333;display: table;white-space: nowrap;margin:10px 10px 10px 0px"
          >
            <span style="display:inline-block">{{scope.title}}</span>
            <!-- <span style="wdith:100%"></span> -->
          </div>
          <edit2
            :key="scope.index"
            :fields="scope.fields"
            :form="scope.form"
            :readonly="readonly"
            :title="scope.title||title"
            :ref="'edit2'+scope.index"
            :loop-find="true"
          />
        </span>
      </template>
    </edit-item>
    <a-input
      v-else
      v-model="form[item.prop]"
      :ref="item._key"
      :style="{width:item.width||itemWidth}"
      :disabled="readonly"
      :readonly="item.readonly"
      :is-edit-item="true"
      :item="item"
      @change="(val)=>{validateItem(form[item.prop],item);}"
    />
    <a-modal
      v-if="proxyComponentDialog3.visible"
      v-model="proxyComponentDialog3.visible"
      width="800px"
      style="top:50px;"
      :title="proxyComponentDialog3.title||'对话框'"
      class="admin-list-component"
      @ok="proxyComponentDialog3.onResult(proxyComponentDialog3.resultData);proxyComponentDialog3.visible=false"
    >
      <div v-if="proxyComponentDialog3.visible">
        <component
          ref="proxyComponent"
          :is="proxyComponentDialog3.component"
          :meta="proxyComponentDialog3.item"
          @onResult="(data)=>proxyComponentDialog3.resultData=data"
        />
      </div>
    </a-modal>
  </span>
</template>

<script>
import editItem from './editItem'
import myCheckboxGroup from './myCheckBoxGroup'
import myInputSearch from './myInputSearch'
import validators from '../editValidators'
import renderView from './rander'

export default {
  props: {
    title: String,
    item: { type: Object },
    form: { type: Object },
    // show: { type: Boolean, default: true },
    readonly: { type: Boolean, default: false },
    itemWidth: { type: String, default: '180px' },
    defaultForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: { editItem, myCheckboxGroup, myInputSearch, renderView },
  data() {
    const vm = this
    return {
      show: true,
      choiceData: [],
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
  computed: {
    value: {
      get() {
        return this.form[this.item.prop]
      },
      set(val) {
        // this.form[this.item.prop]
        this.$set(this.form, this.item.prop, val)
      }
    }
  },
  created() {
    // form应为对象，如果form为空，则推送一个新的
    // if (this.item.prop === 'transTypeCodes') {
    //   debugger
    // }
    if (!this.form) {
      this.$emit('update:form', this.defaultForm)
    }
    if (this.item.bind) {
      this.$watch('form.' + this.item.bind.path, val => this.initRelateValue(val, this.item.bind.path))
      this.initRelateValue(this.form[this.item.bind.path], this.item.prop)
    }

    if (this.item.choice) {
      if (this.item.choice instanceof Function) {
        this.item.choice().then(data => {
          // this.$set(this.choiceData, this.item.prop, data)
          this.choiceData = data
        })
      } else {
        this.choiceData = this.item.choice
      }
    }
  },
  methods: {
    /**
     * 处理关系绑定指令
     */
    initRelateValue(val, prop) {
      // 处理eq，控制显示
      if (this.item.bind && this.item.bind.eq !== undefined) {
        if (val === this.item.bind.eq) {
          // this.item.show = true
          this.$emit('bind-change', { type: 'visible', value: true })
          this.show = true
        } else {
          // this.item.hidden = true
          // this.item.show = true
          this.$emit('bind-change', { type: 'visible', value: false })
          this.show = false
          // this.$set(this.item, 'show', false)
        }
      } else if (this.item.bind && this.item.bind.convert !== undefined) {
        // 处理 convert 格式转换，无法反向
        this.$emit('bind-change', { type: 'value', value: this.item.bind.convert(val) })
      } else if (this.item.bind && this.item.bind.objKey !== undefined) {
        // 处理 convert 格式转换
        if (val !== undefined) {
          const value = {}
          value[this.item.bind.objKey] = val
          this.$emit('bind-change', { type: 'value', value })
        } else if (this.value) {
          // 如果被映射的属性为undefined ，而映射的属性有值，则认为是初始化场景，需要反向映射
          this.$emit('bind-change', {
            type: 'tovalue',
            target: this.item.bind.path,
            value: this.value[this.item.bind.objKey]
          })
        }
      }
    },
    validate() {
      const res = this.validateItem(this.form[this.item.prop], this.item)
      // console.log(this.form[this.item.prop], this.item.prop, res)
      return res
    },
    validateItem(value, item) {
      let validateRes = true
      if (item.customView) {
        const view = this.$refs[item._key] // 1item.__getView()
        if (view && view.validate instanceof Function) {
          if (view.validate()) {
            this.$set(item, 'validateStatus', 'success')
          } else {
            this.$set(item, 'validateStatus', 'error')
            validateRes = false
          }
        } else {
          console.error('请在自定义组件中添加[validate]方法来返回是否通过验证！')
        }
      } else if (item.required && item.multi && (!value || value.length === 0)) {
        this.$set(item, 'validateStatus', 'error')
        this.$set(item, 'errorMessage', '不能为空')
        validateRes = false
      } else if (item.required && !value) {
        this.$set(item, 'validateStatus', 'error')
        this.$set(item, 'errorMessage', '不能为空')
        validateRes = false
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
              validateRes = false
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
      return validateRes
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
    showProxyComponent3(item) {
      this.proxyComponentDialog3.component = item.component
      this.proxyComponentDialog3.visible = true
      this.proxyComponentDialog3.item = item
      this.proxyComponentDialog3.title = item.label
    },
    selectFilterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>

<style>
.edit-form-view .rp-title::before {
  content: '';
  display: table-cell;
  position: relative;
  top: 50%;
  width: 3px;
}
.edit-form-view .rp-title::after {
  content: '';
  display: table-cell;
  position: relative;
  top: 50%;
  width: 99%;
}
</style>
