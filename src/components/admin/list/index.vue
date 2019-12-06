<!--
 * @Author: zhangwc
 * @Date: 2019-08-19 14:02:47
 * @LastEditors: zhangwc
 * @LastEditTime: 2019-08-23 15:32:55
 * @Description:
 -->

<template>
  <div class="admin-list" :style="{padding:compact?'':20+'px'}">
    <div class="lk-custom">
      <div
        v-if="module.showHeader"
        class="panel-body-local-bottom"
        :style="{'border-bottom':compact?'': '1px solid #e8ebee;','padding-bottom':compact?'':'5px','padding-top':compact?'0px':'20px','margin':compact?'':'-20px -20px 0 -20px','padding-left':compact?'0px':'20px'}"
      >
        <slot v-if="!compact" name="title"></slot>
        <a-form
          ref="form"
          layout="inline"
          :class="[compact?'compact':'']"
          laba-position="right"
          :style="{padding:compact?'':'6px 0px;'}"
        >
          <div
            v-if="!compact"
            ref="filterDiv"
            :style="{'transition':'height 0.3s','height':filterExpan?$refs.filterWrap.clientHeight+'px':filterOrginHeight+'px',overflow:'hidden'}"
          >
            <div ref="filterWrap">
              <filters
                :compact="compact"
                :filterFields="filterFields"
                :setSelectFormatterVal="setSelectFormatterVal"
                :resultTableParams="resultTableParams"
                :querySelectFormatterVal="querySelectFormatterVal"
              />
            </div>
          </div>
          <filters
            v-else
            :compact="compact"
            :filterFields="filterFields"
            :setSelectFormatterVal="setSelectFormatterVal"
            :resultTableParams="resultTableParams"
            :querySelectFormatterVal="querySelectFormatterVal"
          />

          <!-- <slot name="filter" /> -->
          <a-form-item
            :style="{'padding-left':compact?'':'90px','width':compact?'':'95%','border-top':compact?'':'1px dashed #e9e9e9','padding-top':compact?'2px':'8px','text-align':module.toolButtonAlign}"
          >
            <a-button
              v-if="module.filterFields&&module.filterFields.length>0"
              type="primary"
              :loading="isSearching||searchAnimationDelay"
              @click="search"
              icon="search"
            >查询</a-button>

            <a-button
              v-if="module.filterFields&&module.filterFields.length>0"
              style="margin-left:5px"
              icon="reload"
              @click="$emit('resetResultParams');resultTableParams=config.resultTableParams || {};querySelectFormatterVal={};"
            >重置</a-button>
            <span style="text-align:right">
              &nbsp;&nbsp;
              <a-button
                v-if="module.addButton"
                style="margin-right:5px;"
                plain
                :type="module.addButton.type?module.addButton.type:'info'"
                icon="plus-circle"
                @click="()=>{if(module.addButton.click){module.addButton.click.call(this)}else{editDialog.visible = true;editDialog.isupdate = false;$set(editDialog,'data',{})}}"
              >{{ module.addButton.label }}</a-button>

              <a-button
                v-else-if="module.canAdd"
                style="margin-right:5px;"
                type="dashed"
                plain
                icon="plus-circle"
                @click="editDialog.show({},false)"
              >添加</a-button>
              <a-button
                v-for="(item, index) in module.toolButtons"
                :key="index"
                style="margin-right:5px;"
                :loading="item.loading"
                plain
                :icon="item.icon"
                :type="item.type?item.type:'dashed'"
                @click="()=>{if(item.component&&beforeComponent(item)){showProxyComponent2(item)}else{item.click()}}"
              >{{ item.label }}</a-button>
            </span>
          </a-form-item>
        </a-form>
        <div
          v-show="showFilterExpan&&!compact"
          style="text-align:center;margin-bottom:-20px;margin-right:10%"
        >
          <span
            type="down"
            style="background:#Fff;padding:0px 20px 3px;font-size:12px;border:1px solid #e8ebee;border-top:none;border-radius:3px"
            @click="filterExpan=!filterExpan"
          >
            <a style="color:#0063b8">{{ filterExpan?'收起':'展开' }}</a>
          </span>
        </div>
      </div>
      <div style="padding:0px">
        <slot v-if="ready" name="body">
          <div :style="{'font-size':'12px',color:'#666','line-height':'22px','height':'22px'}">
            <span
              style="float:left;margin-left:3px;"
            >共有{{ module.resultTable.totalRows }}条结果 &nbsp;&nbsp;&nbsp;</span>
            <transition name="slide-fade">
              <span style="color:#03324e;float:left" v-show="selections.length>0">
                选中
                <span style="color:#b0281b">{{selections.length}}</span> 条记录
              </span>
            </transition>
            <!-- 共选择了 -->
            <!-- <span style="font-size:12px;color:#f14042">{{selections.length}}</span> 条记录 -->
          </div>
          <xw-table
            ref="resultTable"
            :paging="module.paging"
            :opt-buttons="module.optButton"
            :config="module.resultTable"
            :empty-text="tableText"
            @selectionChange="selectionChange"
            @sortChange="sortChange"
          />
        </slot>
      </div>
    </div>
    <a-modal
      v-model="editDialog.visible"
      :title="`${module.name}编辑`"
      :width="dialogWidth"
      :maskClosable="false"
      :footer="module.saveWithOk?undefined:null"
      class="admin-list-edit"
      :style="{top:dialogTop}"
    >
      <div ref="editWrap" v-if="editDialog.visible">
        <!-- {{ editDialog.data }} -->
        <!-- {{editDialog.data}} -->
        <edit
          v-if="module.editStyle==='edit'"
          ref="editForm"
          :showErrorMessage="true"
          :edit-fields="editFields"
          :form.sync="editDialog.data"
          :layout="config.editLayout"
          :formItemWidth="config.editItemWidth"
        />
        <edit2
          v-else-if="module.editStyle==='edit2'"
          ref="editForm"
          :showErrorMessage="true"
          :fields="editFields"
          :form.sync="editDialog.data"
          :layout="config.editLayout"
          :formItemWidth="config.editItemWidth"
        />
      </div>

      <span slot="footer" style="text-align:center" class="dialog-footer">
        <a-button @click="editDialog.visible = false">取消</a-button>
        <a-button v-if="module.saveWithOk" :loading="loading" type="primary" @click="save">确定</a-button>
      </span>
    </a-modal>
    <!-- 按键组件显示 -->
    <a-modal
      v-model="proxyComponentDialog2.visible"
      :width="proxyComponentDialog2.width"
      :title="proxyComponentDialog2.title||'对话框'"
      class="admin-list-component admin-list-edit"
      :maskClosable="false"
      :style="{top:compDialogTop}"
      :footer="proxyComponentDialog2.actionButton?undefined:null"
    >
      <div ref="componentDialogWrap" v-if="proxyComponentDialog2.visible">
        <component
          ref="proxyComponent2"
          :meta="proxyComponentDialog2.item"
          :is="proxyComponentDialog2.component"
          @onResult="(data)=>proxyComponentDialog2.resultData=data"
          @notify="(data)=>proxyComponentDialog2.notify?proxyComponentDialog2.notify(data):''"
          @ok="proxyComponentDialog2.onResult(proxyComponentDialog2.resultData);proxyComponentDialog2.visible=false"
        />
        <!-- <rel-bind
          v-if="$refs.proxyComponent2"
          :source="$refs.proxyComponent2"
          v-model="componentDialogWrapHeight"
          path="clientHeight"
          :debugger="true"
        />-->
      </div>
      <div slot="footer" v-if="proxyComponentDialog2.actionButton">
        <a-button @click="proxyComponentDialog2.visible = false">取消</a-button>
        <a-button type="primary" @click="toolButtonClick">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import XwTable from '@/components/xwTable'
import { axios } from '@/utils/request'
import filters from './filters'
import relBind from '../edit/relBind'

export default {
  components: {
    XwTable,
    filters,
    relBind
  },
  props: {
    compact: {
      // 是否紧凑，是的话会去掉间距和标题等占空间的地方
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: () => {
        return {
          tableColumns: [],
          editFields: [],
          filterFields: [],
          optButton: [],
          toolButtons: [],
          choicePromiseList: [],
          singleSelect: false,
          saveWithOk: true // 当编辑框点击确认的时候是否保存
        }
      }
    },
    filter: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const vm = this
    return {
      screenWidth: document.documentElement.clientWidth, // 屏幕宽度
      screenHeight: document.documentElement.clientHeight,
      editFormHeight: 0,
      componentDialogWrapHeight: 0,
      filterOrginHeight: 90,
      showFilterExpan: true,
      size: '',
      form: {},
      rules: [],
      loading: false,
      tagList: [],
      resultTableParams: {},
      temp: {},
      ready: true,
      isSearching: false, // 当前是否正在查询中
      searchAnimationDelay: false,
      choiceMap: {},
      querySelectFormatterVal: {}, // from提交时将会转换
      formSelectFormatterVal: {},
      module: null,
      tableText: '无数据展示，请查询',
      beforeSubmit(formData) {},
      filterExpan: false, // 查询条件展开
      selections: [], // 被选中的行
      editItemWidth: null,
      editDialog: {
        data: {},
        visible: false,
        isupdate: false,
        show(data, isupdate = false) {
          vm.editDialog.data = data
          vm.editDialog.beforeEdit(data, isupdate)
          vm.editDialog.isupdate = isupdate
          vm.editDialog.visible = true
          vm.$nextTick(() => {
            // debugger
            vm.editFormHeight = vm.$refs.editWrap.clientHeight
          })
        },
        beforeEdit() {
          if (vm.module.beforeEdit instanceof Function) {
            vm.module.beforeEdit(vm.editDialog.data)
          }
        }
      },
      proxyComponentDialog2: {
        visible: false,
        component: null,
        item: null,
        resultData: null,
        title: null,
        width: '960px',
        actionButton: true,
        notify: null,
        onResult(_data) {
          // if(vm.$refs.proxyComponent2.get){}
          // if (vm.proxyComponentDialog2.item.onResult) {
          //   vm.proxyComponentDialog2.item.onResult(data)
          // }
          let data = _data
          if (!vm.$refs.proxyComponent2.getComponentValue) {
            debugger
            throw new Error('请给代理组件实现 getComponentValue 方法')
          }
          const val = vm.$refs.proxyComponent2.getComponentValue()
          if (val) {
            data = val
          }
          if (vm.proxyComponentDialog2.item.onResult) {
            vm.proxyComponentDialog2.item.onResult(data)
          }
        }
      }
    }
  },
  computed: {
    displayEditFields() {
      if (typeof this.module.editFields === 'function') {
        return this.module.editFields(this.editDialog.data).filter(item => !item.hidden)
      }
      return this.module.editFields.filter(item => !item.hidden)
    },
    // 编辑框宽度，根据内容动态计算
    dialogWidth() {
      if (this.config.editFields && this.config.editFields.length < 20) {
        return '800px'
      }
      return '1100px'
    },
    dialogTop() {
      const top = (this.screenHeight - this.editFormHeight) / 2
      console.log(this.screenHeight, this.editFormHeight)
      // if (this.editFormHeight > this.screenHeight - 60) {
      //   return '20px'
      // }
      // const top = (this.screenHeight - this.editFormHeight) / 2
      if (top > 100) {
        return '100px'
      }
      if (top - 65 < 0) {
        return '20px'
      }
      return top - 65 + 'px'
    },
    compDialogTop() {
      const top = (this.screenHeight - this.componentDialogWrapHeight) / 2
      if (top > 100) {
        return '100px'
      }
      if (top - 65 < 0) {
        return '20px'
      }
      return top - 65 + 'px'
    },
    optColumnWidth() {
      let width = 0
      if (this.config.canEdit) {
        width += 50
      }
      if (this.config.optButton) {
        width += this.config.optButton.length * 50
      }
      width = width > 150 ? 150 : width

      return width
    },
    filterFields() {
      return this.module.filterFields
    },
    editFields() {
      if (this.module.getEditFields instanceof Function) {
        return this.module.getEditFields()
      } else {
        return this.module.editFields
      }
    }
  },
  watch: {
    screenWidth() {
      this.initFilterDivHeight()
    },
    isSearching() {
      this.searchAnimationDelay = true
      setTimeout(() => {
        this.searchAnimationDelay = false
      }, 500)
    }
  },
  created() {
    this.module = this.initConfig()

    this.resultTableParams = this.config.resultTableParams || {}

    if (this.module.created) {
      this.module.created.call(this, this.module)
    }
  },
  updated() {
    if (this.$refs.componentDialogWrap) {
      this.componentDialogWrapHeight = this.$refs.componentDialogWrap.clientHeight
    }
  },
  methods: {
    setFormModel(model = 'update') {
      if (model === 'update') {
        this.editDialog.isupdate = true
      }
    },
    /**
     * 设置选择框的格式化数据，提交时将会提交格式化的内容
     */
    setSelectFormatterVal(item, val, list) {
      if (item.acitonValue) {
        if (val) {
          this.querySelectFormatterVal[item.prop] = item.acitonValue(val)
        } else {
          this.querySelectFormatterVal[item.prop] = null
        }
      } else {
        this.querySelectFormatterVal[item.prop] = val
      }
    },
    /**
     * 转换choice 为map
     */
    getChoiceDataMap(key) {
      const map = {}
      this.choiceMap[key].forEach(c => {
        map[c.value] = c.label
      })
      return map
    },
    /**
     * 根据配置转换a-table识别的格式，并且根据类型增加渲染器
     */
    getColumns(selectable) {
      const columns = []
      for (const item of this.config.tableColumns) {
        const key = Math.random()
          .toString(36)
          .slice(-8)
        const column = { title: item.label, dataIndex: item.prop, key }

        if (item.choice instanceof Function) {
          column.customRender = (text, record, index) => {
            const prop = item.prop
            return this.getChoiceDataMap(prop)[text] || text
          }
        } else if (item.choice) {
          const map = {}
          item.choice.forEach(c => {
            map[c.value] = c.label
          })
          column.customRender = (text, record, index) => {
            return map[text] || text
          }
        } else if (item.formatter) {
          column.customRender = (text, record, index) => {
            return item.formatter(text, record) || text
          }
        } else {
          // 空值填充 --
          column.customRender = (text, record) => {
            return text === undefined || text === null || text === '' ? '--' : text
          }
        }
        // 自定义渲染优先
        if (item.render && item.render instanceof Function) {
          // column.scopedSlots = { customRender: 'chtml' }
          // column.html = item.html
          const createElement = this.$createElement
          column.customRender = (text, record, index) => {
            const vnode = item.render(createElement, text, record, index)
            return vnode
          }
        }
        column.width = item.width || ''
        column.fixed = item.fixed || ''
        column.align = item.align || 'left'
        columns.push(column)
      }
      if (this.optColumnWidth > 0) {
        columns.push({
          title: '操作',
          dataIndex: columns[0].dataIndex,
          key: columns[0].prop,
          width: 40 + this.optColumnWidth + 'px',
          scopedSlots: { customRender: 'optButton' }
        })
      }
      return columns
    },
    getFilter() {
      return this.filter
    },
    initConfig() {
      const vm = this
      // 检查所有过滤、列表字段是否存在异步获取格式化值的方法，如果有执行异步指定结果
      const config = Object.assign(
        {},
        {
          name: null,
          baseUrl: '/api/epComponent/',
          deleteUrl: null, // 删除路径
          deleteMethod: 'post',
          currcentTabPane: 'resultTablePane',
          tableMethod: 'post',
          tableColumns: [],
          canDelete: false,
          canEdit: false,
          canAdd: true,
          showHeader: true,
          editFields: [],
          filterFields: [],
          optButton: [],
          toolButtons: [],
          toolButtonAlign: 'left',
          choicePromiseList: [],
          editStyle: 'edit', // edit2 //指定用edit还是edit2 渲染
          paging: true,
          selectable: true, // 是否显示选择框
          saveWithOk: true, // 是否显示确认按键
          singleSelect: false, // 是否单选
          defaultQuery: true, // 是否默认查询
          beforeEdit(form) {}, // 记录修改之前
          getTableUrl() {
            return this.baseUrl
          },
          resultTable: this.override(XwTable.defaults, {
            // tableRowClassName: this.config.tableRowClassName,
            columns: this.getColumns(),
            tableExpandRender: this.config.tableExpandRender,
            isHideOnSinglePage: this.config.isHideOnSinglePage || false,
            scroll: this.config.scroll || {},
            selectable: this.config.selectable === undefined || this.config.selectable,
            singleSelect: this.config.singleSelect || false,
            defaultQuery: this.config.defaultQuery === undefined,
            onLoadData2: async (pageNum, pageSize) => {
              this.resultTable.loading = true
              const vm = this
              for (const key in this.resultTableParams) {
                if (this.resultTableParams[key] === '') {
                  this.resultTableParams[key] = null
                }
              }
              const tableUrl = this.module.getTableUrl()
              if (!tableUrl) {
                vm.resultTable.loading = false
                console.warn('列表请求地址有误，请检查代码')
                return
              }
              this.isSearching = true
              await axios({
                url: tableUrl,
                method: this.module.tableMethod,
                data: Object.assign(
                  {
                    pageSize,
                    pageNum
                  },
                  this.getFilter ? this.getFilter() : null,
                  this.resultTableParams,
                  this.querySelectFormatterVal
                )
              })
                .then(data => {
                  let _data = data

                  if (!data.data) {
                    vm.resultTable.loading = false
                    vm.tableText = data.message || '无数据'
                    return
                  }
                  if (this.module.dataFormatter) {
                    _data = this.module.dataFormatter(data)
                  }
                  vm.resultTable.totalPages = parseInt(_data.data.pages)
                  vm.resultTable.totalRows = parseInt(_data.data.total)
                  vm.resultTable.data = _data.data.list
                  vm.resultTable.loading = false
                  if (vm.resultTable.totalRows === 0) {
                    vm.tableText = '查询无数据'
                  }
                })
                .catch(e => {
                  vm.resultTable.data = null
                  vm.tableText = e.message || '查询无数据'
                  vm.resultTable.loading = false
                })
              this.isSearching = false
            },
            onLoadData3: () => {
              this.resultTable.loading = true
              const vm = this
              const data = Object.assign({}, this.getFilter ? this.getFilter() : null, this.resultTableParams)
              axios({
                url: this.module.getTableUrl(),
                method: this.module.tableMethod,
                params: this.module.tableMethod.toUpperCase() === 'POST' ? null : data,
                data: this.module.tableMethod.toUpperCase() === 'POST' ? data : null
              }).then(data => {
                let _data = data
                if (this.module.dataFormatter) {
                  _data = this.module.dataFormatter(data)
                }
                vm.resultTable.totalPages = 1
                vm.resultTable.totalRows = parseInt(_data.data.length)
                vm.resultTable.data = _data.data
                vm.resultTable.loading = false
              })
            }
          })
        },
        this.config
      )
      config.filterFields.concat(config.tableColumns).forEach(item => {
        if (item.choice) {
          if (item.choice instanceof Function) {
            this.choiceMap[item.prop] = []
            item.choice().then(data => {
              this.choiceMap[item.prop] = data
            })
          } else {
            this.choiceMap[item.prop] = item.choice
          }
        }
      })

      const promiseList = []

      for (const fieldConfig of config.tableColumns) {
        if (fieldConfig.choice instanceof Function) {
          promiseList.push([fieldConfig.choice(), fieldConfig.prop])
        }
      }
      // this.$nextTick(() => {
      //   if (promiseList.length > 0) {
      //     this.choicePromiseList = promiseList
      //     this.doChoicePromise()
      //   } else {
      //     this.ready = true
      //   }
      // })

      // 增加操作按键

      const buttons = []
      if (this.config.canEdit) {
        buttons.push({
          label: '编辑',
          click(row) {
            vm.editDialog.show(Object.assign({}, row), true)
            // vm.editDialog.handleDefaultValue()
          }
        })
      }
      if (this.config.canDelete) {
        buttons.push({
          label: '删除',
          click(row) {
            if (!vm.config.deleteUrl) {
              console.error('删除路径不能为空')
            }
          }
        })
      }
      config.optButton = buttons.concat(config.optButton)

      return config
    },
    // doChoicePromise() {
    //   debugger
    //   if (this.choicePromiseList.length > 0) {
    //     const item = this.choicePromiseList.pop()
    //     item[0].then(data => {
    //       this.temp[item[1] + '-choice'] = data
    //       this.doChoicePromise()
    //     })
    //   } else {
    //     this.ready = true
    //   }
    // },

    handleFormData() {},
    showLabel(column) {
      if (column instanceof Object) {
        if (column.label) {
          return column.label
        }
      }
      return column.prop
    },
    showProp(column) {
      if (column instanceof Object) {
        return column.prop
      }
      return column
    },
    save(data) {
      console.log('保存')
      // 多选变成字符串
      const list =
        this.module.editFields instanceof Function
          ? this.module.editFields(this.editDialog.data)
          : this.module.editFields

      //  const form = Object.assign({}, this.editDialog.data, this.formSelectFormatterVal)
      const vm = this

      this.$refs.editForm
        .validate()
        .then(form => {
          list.forEach(item => {
            // if (item.choice && item.multi && form[item.prop]) {
            //   form[item.prop] = form[item.prop].join(',')
            // }
            if (item.hidden) {
              form[item.prop] = item.default
            }
          })

          const method = 'post'
          let _form = form
          const url = this.editDialog.isupdate ? this.module.updateUrl : this.module.saveUrl
          if (this.module.beforeSubmit) {
            const res = this.module.beforeSubmit(form, this.editDialog.isupdate)
            if (res) {
              _form = res
            }
          }
          this.loading = true
          axios({
            url,
            method,
            data: _form
          }).then(
            data => {
              console.log(data)
              this.$emit('save', { form: this.form, result: data })
              let afterResult = null
              if (this.module.afterSubmit instanceof Function) {
                afterResult = this.module.afterSubmit(data, vm.editDialog.data)
              }
              if (typeof afterResult === 'boolean' && !afterResult) {
                console.log('阻断默认处理')
              } else if (afterResult && afterResult instanceof Promise) {
                afterResult.then(
                  () => {
                    this.editDialog.visible = false
                    this.resultTable.reload()
                    this.$message.success('保存成功')
                    this.loading = false
                  },
                  () => {
                    this.loading = false
                  }
                )
              } else {
                this.$nextTick(() => {
                  this.editDialog.visible = false
                  this.resultTable.reload()
                  this.$message.success('保存成功')
                  this.loading = false
                })
              }
            },
            e => {
              this.loading = false
              this.$message.error(e.message)
            }
          )
        })
        .catch(e => {})
    },
    search() {
      this.resultTable.reload(1)
    },
    selectionChange(val) {
      this.selections = val
      this.$emit('selectionChange', val)
    },
    sortChange({ prop, order }) {
      if (order === 'descending') {
        this.resultTableParams.sort_desc = prop
        this.resultTableParams.sort_asc = null
      } else {
        this.resultTableParams.sort_asc = prop
        this.resultTableParams.sort_desc = null
      }
      this.resultTable.reload()
    },
    /**
     * 按键代理
     */
    showProxyComponent2(item) {
      this.proxyComponentDialog2.component = item.component
      this.proxyComponentDialog2.visible = true
      this.proxyComponentDialog2.item = item
      this.proxyComponentDialog2.title = item.label
      this.proxyComponentDialog2.actionButton =
        item.componentActionButton === undefined ? true : item.componentActionButton
      this.proxyComponentDialog2.width = item.componentWidth || '950px'
      this.proxyComponentDialog2.notify = item.notify
      this.$nextTick(() => {
        // debugger
        this.componentDialogWrapHeight = this.$refs.componentDialogWrap.clientHeight
      })
    },
    beforeComponent(item) {
      if (item.beforeComponent) {
        return item.beforeComponent()
      } else {
        return true
      }
    },
    /**
     * 显示编辑对话框
     */
    showEditDialog(isupdate = false, data = {}) {
      this.editDialog.visible = true
      this.editDialog.isupdate = isupdate
      this.editDialog.data = data
      this.loading = false
    },
    initFilterDivHeight() {
      const wrap = this.$refs.filterWrap
      const div = this.$refs.filterDiv
      if (div) {
        if (wrap.clientHeight > div.clientHeight) {
          this.showFilterExpan = true
        } else {
          if (div.clientHeight - wrap.clientHeight > 35) {
            div.style.height = wrap.clientHeight + 'px'
            this.filterOrginHeight = wrap.clientHeight
          }
          this.showFilterExpan = false
        }
      }
      // debugger
    },
    toolButtonClick() {
      const component = this.$refs.proxyComponent2
      if (component.getComponentSubmitPromise) {
        component.getComponentSubmitPromise().then(
          data => {
            if (this.proxyComponentDialog2.item.onResult) {
              this.proxyComponentDialog2.item.onResult({ status: 'success', data })
            }
            // this.proxyComponentDialog2.onResult(data)
            this.proxyComponentDialog2.visible = false
          },
          data => {
            if (this.proxyComponentDialog2.item.onResult) {
              this.proxyComponentDialog2.item.onResult({ status: 'error', data })
            }
            // this.proxyComponentDialog2.onResult(data)
          }
        )
      } else {
        this.proxyComponentDialog2.onResult(this.proxyComponentDialog2.resultData)
        this.proxyComponentDialog2.visible = false
        // proxyComponentDialog2.onResult(proxyComponentDialog2.resultData);proxyComponentDialog2.visible=false
      }
    }
  },
  mounted() {
    var _this = this
    window.onresize = function() {
      // 定义窗口大小变更通知事件
      _this.screenWidth = document.documentElement.clientWidth // 窗口宽度
      _this.screenHeight = document.documentElement.clientHeight // 窗口高度
    }
    this.initFilterDivHeight()
    // debugger
  }
}
</script>
<style  >
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(-10px);
  opacity: 0;
}
.lk-custom .panel-body-local,
.panel-body-local-bottom,
.panel-body-local-top {
  background: #fff;
  padding-left: 20px;
  padding-right: 20px;
  border-width: 1px;
  border-color: #dcdfe6;
}

.lk-custom .ant-table-small > .ant-table-content > .ant-table-body {
  margin: 0px;
}
.lk-custom .ant-input {
  font-size: 12px;
}

.admin-list-edit .lk-edit2 .ant-form-item-label label {
  width: 148px;
}

/* .lk-custom .ant-form-item-label label {
  color: #666 !important;
  font-size: 12px;
  font-weight: normal;
} */
.lk-custom .compact .ant-form-item-label label {
  width: auto;
}

.lk-custom .ant-select-selection__rendered {
  font-size: 12px;
}

.lk-custom .ant-table-thead th {
  color: #888;
  font-size: 12px;
  height: 28px;
}
.lk-custom .ant-table {
  font-size: 12px;
  color: #666;
}
.lk-custom .ant-table-pagination.ant-pagination {
  width: 100%;
  text-align: right;
  margin: 0px;
  padding: 7px 10px;
  border: 1px #e8e8e8 solid;
  border-top: none;
}
.lk-custom .ant-form-item-label label {
  width: 90px;
  display: flex;
  justify-content: flex-end;
  color: #666 !important;
}
/* .admin-dialog .ant-form-item-label label {
  width: 100px;
  display: flex;
  justify-content: flex-end;
  color: #909399 !important;
}
.admin-dialog .ant-form-inline .ant-form-item {
  margin-bottom: 10px;
} */

.lk-custom h2 {
  font-weight: 400;
  padding: 0;
  margin: 0;
  border: 0;
  outline: 0;
  font-weight: inherit;
  font-style: inherit;
  font-family: inherit;
  font-size: 100%;
  color: #333;
  line-height: 40px;
  vertical-align: baseline;
  border-bottom: 1px solid #e8ebee;
  margin-bottom: 8px;
}
</style>
