/*
 * @Author: zhangwencan
 * @Date: 2019-09-25 21:08:53
 * @Last Modified by: zhangwencan
 * @Last Modified time: 2019-10-22 19:34:15
 */
<template>
  <span>
    <!-- {{resultTableParams}} -->
    <a-form-item
      v-for="(item, index) in filterFields"
      :key="'b'+index"
      style="padding-top:2px;line-height:20px;margin-bottom:2px;padding-right:10px;"
      :label="compact?'':item.label"
    >
      <a-select
        v-if="item.choice&&(typeof(item.choice)==='function')"
        v-model="resultTableParams[item.prop]"
        allow-clear
        :placeholder="compact?item.label:'请选择'"
        :style="{width:itemWidth}"
        @change="(val)=>setSelectFormatterVal(item,val,choiceMap[item.prop])"
      >
        <a-select-option
          v-for="(c, index1) in choiceMap[item.prop]"
          :key="'f'+index1"
          :value="c.value"
        >{{ c.label }}</a-select-option>
      </a-select>
      <a-select
        v-else-if="item.choice"
        v-model="resultTableParams[item.prop]"
        allow-clear
        :placeholder="compact?item.label:'请选择'"
        :defaultValue="item.default"
        :style="{width:itemWidth}"
      >
        <a-select-option
          v-for="(c, index2) in item.choice"
          :key="'a'+index2"
          :value="c.value"
        >{{ c.label }}</a-select-option>
      </a-select>
      <component
        :is="item.customView"
        v-else-if="item.customView"
        :meta="item"
        :style="{width:item.width||itemWidth}"
        :width="item.width||itemWidth"
        v-model="resultTableParams[(item.prefix?item.prefix:'')+item.prop]"
      />
      <a-range-picker
        v-else-if="item.type==='range-date'"
        v-model="resultTableParams[item.startProp]"
        style="width:465px;"
        :format="item.format||'YYYY-MM-DD'"
        @change="(s,array)=>
            {
              querySelectFormatterVal[item.startProp]=array[0];querySelectFormatterVal[item.endProp]=array[1];
            }"
      />
      <a-input-number
        v-else-if="item.type==='num'"
        v-model="resultTableParams[item.prop]"
        :style="{width:itemWidth}"
      />
      <a-input-search
        v-else-if="item.component"
        v-model="resultTableParams[(item.prefix?item.prefix:'')+item.prop]"
        icon="ellipsis"
        disabled
        :placeholder="compact?item.label:'请查找'"
        clearable
        :style="{width:itemWidth}"
        maxlength="100"
        @search="showProxyComponent(item,resultTableParams,(item.prefix?item.prefix:'')+item.prop)"
      >
        <a-button slot="enterButton" icon="ellipsis" />
        <!-- <a-icon slot="enterButton" type="ellipsis" /> -->
      </a-input-search>
      <a-input
        v-else-if="!item.type"
        v-model="resultTableParams[(item.prefix?item.prefix:'')+item.prop]"
        :placeholder="compact?item.label:'请输入'"
        clearable
        :style="{width:itemWidth}"
        maxlength="100"
      />
    </a-form-item>
    <a-modal
      v-model="proxyComponentDialog.visible"
      :maskClosable="false"
      width="800px"
      :title="proxyComponentDialog.title||'对话框'"
      class="admin-list-component"
      centered
    >
      <div v-if="proxyComponentDialog.visible">
        <component
          ref="proxyComponent"
          :is="proxyComponentDialog.component"
          @onResult="proxyComponentDialog.onResult"
        />
      </div>
      <span slot="footer" style="text-align:center" class="dialog-footer">
        <a-button type="primary" @click="okClick()">确定</a-button>
      </span>
    </a-modal>
  </span>
</template>

<script>
export default {
  props: ['resultTableParams', 'filterFields', 'setSelectFormatterVal', 'compact', 'querySelectFormatterVal'],
  computed: {
    itemWidth() {
      if (!this.compact) {
        return '180px'
      }
      return '160px'
    }
  },
  data() {
    const vm = this
    return {
      choiceMap: {},
      proxyComponentDialog: {
        visible: false,
        component: null,
        form: null,
        prop: null,
        item: null,
        title: null,
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
          if (vm.proxyComponentDialog.item.formatter) {
            const { label, value } = vm.proxyComponentDialog.item.formatter(data)
            vm.proxyComponentDialog.form[vm.proxyComponentDialog.prop] = label
            vm.querySelectFormatterVal[vm.proxyComponentDialog.prop] = value
            return
          }
          vm.proxyComponentDialog.form[vm.proxyComponentDialog.prop] = data
        }
      }
    }
  },
  created() {
    this.filterFields.forEach(item => {
      if (item.choice) {
        if (item.choice instanceof Function) {
          item.choice().then(data => {
            this.$set(this.choiceMap, item.prop, data)
          })
        } else {
          this.choiceMap[item.prop] = item.choice
        }
      }
    })
  },
  methods: {
    /**
     * 过滤代理组件
     */
    showProxyComponent(item, form, prop) {
      this.proxyComponentDialog.component = item.component
      this.proxyComponentDialog.visible = true
      this.proxyComponentDialog.form = form
      this.proxyComponentDialog.prop = prop
      this.proxyComponentDialog.item = item
      this.proxyComponentDialog.title = item.label
      this.proxyComponentDialog.width = item.componentWidth
    },
    okClick() {
      const component = this.$refs.proxyComponent
      if (component.getComponentSubmitPromise) {
        component.getComponentSubmitPromise().then(
          data => {
            this.proxyComponentDialog.onResult(data)
            this.proxyComponentDialog.visible = false
          },
          data => {
            this.proxyComponentDialog.onResult(data)
          }
        )
      } else {
        this.proxyComponentDialog.onResult(this.proxyComponentDialog.resultData)
        this.proxyComponentDialog.visible = false
      }
    }
  }
}
</script>
