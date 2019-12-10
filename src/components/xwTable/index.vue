<template>
  <div class="xw-table" style="background:#FFF;">
    <a-table
      :row-selection="selection"
      :customRow="customRow"
      :columns="columns"
      :scroll="config.scroll"
      :data-source="data"
      :pagination="{current:currentPage,pageSize,total:totalRows,showSizeChanger:true,size:'small',hideOnSinglePage: isHideOnSinglePage||!paging}"
      :loading="loading"
      :locale="{emptyText:emptyText}"
      :rowClassName="rowClassName"
      size="small"
      @change="handleTableChange"
      :expandedRowRender="config.tableExpandRender?tableExpandRender:undefined"
      :class="[config.singleSelect?'singleSelect':'']"
    >
      <template slot="optButton" slot-scope="text,record">
        <span v-if="optButtons.length<4" @click="buttonClick">
          <span v-for="(button, index) in optButtons" :key="index">
            <a
              :disabled="button.disabled?button.disabled(record):false"
              @click="()=>{optButtonClick(button,record);}"
            >
              {{ button.label }}
              <div v-if="index< optButtons.length-1" class="ant-divider ant-divider-vertical" />
            </a>
          </span>
        </span>
        <div v-else @click="buttonClick">
          <a
            :disabled="optButtons[0].disabled?button.disabled(record):false"
            @click="(e)=>{optButtonClick(optButtons[0],record)}"
          >
            {{ optButtons[0].label }}
            <div class="ant-divider ant-divider-vertical" />
          </a>
          <!-- <a :disabled="optButtons[1].disabled?button.disabled(record):false" @click="()=>{optButtons[1].click(record)}">
            {{ optButtons[1].label }}
            <div class="ant-divider ant-divider-vertical" />
          </a>-->
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item
                v-for="(item, index) in optButtons.slice(1)"
                :key="'m'+index"
                @click="()=>{optButtonClick(item,record);}"
              >{{ item.label }}</a-menu-item>
            </a-menu>
            <a href="#">
              更多
              <a-icon type="down" />
            </a>
          </a-dropdown>
        </div>
      </template>
      <template slot="chtml" slot-scope="text,record,index">
        <span>{{ index }}</span>
      </template>
    </a-table>

    <a-modal
      v-model="optComponentDialog.visible"
      :width="optComponentDialog.width"
      :title="optComponentDialog.title||'对话框'"
      class="admin-list-component admin-list-edit"
      :maskClosable="false"
      :style="{top:compDialogTop}"
      :footer="optComponentDialog.actionButton?undefined:null"
      @ok="optComponentDialog.onResult(optComponentDialog.resultData);optComponentDialog.visible=false"
    >
      <div ref="componentDialogWrap" v-if="optComponentDialog.visible">
        <component
          ref="optComponent"
          :meta="optComponentDialog.item"
          :data="optComponentDialog.resultData"
          :is="optComponentDialog.component"
          @onResult="(data)=>optComponentDialog.resultData=data"
          @notify="(data)=>optComponentDialog.notify?optComponentDialog.notify(data):''"
          @ok="optComponentDialog.onResult(optComponentDialog.resultData);optComponentDialog.visible=false"
        />
      </div>
      <div slot="footer" v-if="optComponentDialog.actionButton">
        <a-button @click="optComponentDialog.visible=false">取消</a-button>
        <a-button type="primary" @click="optComponentOk()">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
// const columns = [
//   {
//     title: 'Name',
//     dataIndex: 'deviceProviderName',
//     width: '20%'
//   }
// ]
export default {
  name: 'XwTable',
  props: {
    config: {
      // 配置：如下defaults
      type: Object,
      default: () => {}
    },
    paging: {
      type: Boolean,
      default: true
    },
    optButtons: {
      type: Array,
      default: () => []
    },
    emptytip: {
      type: String,
      default: ''
    },
    emptyimgsrc: {
      type: String,
      default: ''
    },
    tools: {
      type: Array,
      default: () => []
    },
    emptyText: {
      type: String,
      default: '无展示数据，请查询'
    }
  },
  defaults: {
    columns: [],
    hasRefresh: true, // 是否有刷新按键
    totalPages: 0,
    totalRows: 0,
    loading: false,
    data: [],
    singleSelect: false,
    isHideOnSinglePage: false, // 当list只有一个页面的时候，是否隐藏分页器
    scroll: {},
    defaultQuery: true, // 默认查询
    selectable: true,
    tableExpandRender() {}, // 展开渲染
    reload: function() {}, // 重新加载数据 此方法会反向指定，不必赋值
    columnClick: function() {}, // 回调
    onLoadData: function(limit, skip) {}, // 回调
    onLoadData2: function(pageNo, pageSize) {}, // 回调
    onLoadData3: function() {}, // 无分页
    tableRowClassName: function(row, rowIndex) {
      return ''
    }
  },
  data() {
    const vm = this
    return {
      // emptyText: '暂无数据，请查询',
      screenHeight: document.documentElement.clientHeight,
      componentDialogWrapHeight: 0,
      pageSize: 10,
      currentPage: 1,
      selectedRowKeys: [],
      // 默认只有单叶时，不隐藏分页器
      isHideOnSinglePage: false,
      optComponentDialog: {
        visible: false,
        component: null,
        item: null,
        resultData: null,
        title: null,
        width: '960px',
        actionButton: true,
        notify: null,
        onResult(_data) {
          // if(vm.$refs.optComponent.get){}
          // if (vm.optComponentDialog.item.onResult) {
          //   vm.optComponentDialog.item.onResult(data)
          // }
          let data = _data
          if (!vm.$refs.optComponent.getComponentValue) {
            debugger
            throw new Error('请给代理组件实现 getComponentValue 方法')
          }
          const val = vm.$refs.optComponent.getComponentValue()
          if (val) {
            data = val
          }
          if (vm.optComponentDialog.item.onResult) {
            vm.optComponentDialog.item.onResult(data)
          }
        }
      }
    }
  },
  watch: {
    //   'config.data'(n, o) {
    //     this.emptyText = '暂无数据'
    //   }

    // config中传入已经选择的rows
    'config.selectedRows': {
      handler(val) {
        this.autoSelectRows(val)
      }
    }
  },
  computed: {
    data: {
      get() {
        return this.config.data || []
      },
      set(data) {
        this.$set(this.config, 'data', data)
        // this.config.data = data
      }
    },
    hasRefresh() {
      return this.config.hasRefresh || true
    },
    totalPages() {
      return this.config.totalPages || 0
    },
    totalRows() {
      return this.config.totalRows || 0
    },
    loading() {
      return this.config.loading
    },
    selection() {
      if (this.config.selectable) {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.handleSelectionChange
        }
      } else {
        return null
      }
    },
    columns() {
      // 支持两种格式，一种为a-table、一种为admin的label-prop格式
      if (this.config.columns) {
        if (this.config.columns.length > 0 && this.config.columns[0].label) {
          return this.getColumns(this.config.columns)
        }
        return this.config.columns
      }

      return []
    },
    optColumnWidth() {
      let width = 0

      if (this.optButtons) {
        width += this.optButtons.length * 50
      }
      width = width > 150 ? 150 : width

      return width
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
    }
  },
  created() {
    // config有pageSize
    if (this.config.pageSize) {
      this.pageSize = this.config.pageSize
    }
    if (this.config.isHideOnSinglePage) {
      this.isHideOnSinglePage = true
    }
    // 增加刷新方法
    this.config.reload = pageNo => {
      if (pageNo) {
        this.currentPage = pageNo
      }
      this.loadData()
    }
    this.config.query = () => {
      this.currentPage = 1
      this.loadData()
    }
  },
  mounted() {
    const query = this.config.defaultQuery === undefined ? true : this.config.defaultQuery
    if (query) {
      this.loadData()
    }
  },
  methods: {
    buttonClick(e) {
      e.stopPropagation()
    },
    tableExpandRender(record, index, indent, expanded) {
      return this.config.tableExpandRender(this.$createElement, record)
    },
    // setTableData(data) {
    //   this.config.data = data
    // },
    customRow(record, index) {
      return {
        props: {},
        on: {
          // 事件
          dbclick() {},
          click: () => {
            // console.log(this.selectedRowKeys, this.selectable)
            if (this.config.selectable) {
              if (this.selectedRowKeys.includes(index)) {
                this.selectedRowKeys = this.selectedRowKeys.filter(item => item !== index)
                // this.$emit(
                //   'selectionChange',
                //   this.selectedRowKeys.map(index => {
                //     return this.data[index]
                //   })
                // )
                this.handleSelectionChange(this.selectedRowKeys)
              } else {
                this.selectedRowKeys.push(index)
                this.handleSelectionChange(this.selectedRowKeys)
              }
            }
          }
        }
      }
    },
    sortChange(params) {
      this.$emit('sortChange', params)
    },
    rowClassName(record, index) {
      if (index % 2 === 0) {
        return ''
      } else {
        return 'row-background'
      }
    },
    handleSelectionChange(val) {
      if (this.config.singleSelect) {
        if (val.length > 1) {
          this.selectedRowKeys = [val[1]]
        } else {
          this.selectedRowKeys = val
        }
      } else {
        this.selectedRowKeys = val
      }
      this.$emit(
        'selectionChange',
        this.selectedRowKeys.map(index => {
          return this.data[index]
        })
      )
    },
    // onSelectChange(selectedRowKeys) {
    //   console.log('selectedRowKeys changed: ', selectedRowKeys)
    //   this.selectedRowKeys = selectedRowKeys
    // },
    tableRowClassName({ row, rowIndex }) {
      if (this.config.tableRowClassName) {
        return this.config.tableRowClassName(row, rowIndex)
      }
      return ''
    },
    columnClick: function() {
      this.config.columnClick()
    },
    /**
     * 加载数据，如果有data参数，优先显示传入数据，不会请求网络
     */
    loadData(data) {
      if (data !== undefined) {
        this.config.data = data
        return
      }
      this.selectedRowKeys = []
      this.$emit('selectionChange', [])
      this.config.pageNo = this.currentPage
      this.config.pageSize = this.pageSize
      if (this.paging) {
        if (this.config.onLoadData) {
          this.config.onLoadData(this.pageSize, (this.currentPage - 1) * this.pageSize)
        }
        if (this.config.onLoadData2) {
          this.config.onLoadData2(this.currentPage, this.pageSize)
        }
      } else {
        // this.config.onLoadData3()
        this.config.onLoadData3.call(this)
      }
    },
    pageChange(curr) {
      this.currentPage = curr
      this.loadData()
    },
    handleTableChange(pagination, filters, sorter) {
      // const pager = { ...this.pagination }
      // pager.current = pagination.current
      // this.pagination = pager
      this.pageSize = pagination.pageSize
      this.pageChange(pagination.current)
    },

    // 自动选择上 config中传入的rows
    autoSelectRows(rowsShouldSelect) {
      if (!rowsShouldSelect || !rowsShouldSelect.length) return

      // 自动选择的基准字段
      const AUTO_SELECT_FLAG = this.config.autoSelect

      try {
        rowsShouldSelect.forEach(row => {
          this.data.map((value, index) => {
            if (value[AUTO_SELECT_FLAG] === row[AUTO_SELECT_FLAG]) {
              this.selectedRowKeys.push(index)
            }
          })
        })
      } catch (e) {
        console.log('autoSelectRows 方法报错', e)
      }
    },
    getColumns(tableColumns) {
      const columns = []
      for (const item of tableColumns) {
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

        columns.push(column)
      }
      if (this.optColumnWidth > 0) {
        columns.push({
          title: '操作',
          dataIndex: columns[0].dataIndex,
          key: columns[0].prop,
          width: 20 + this.optColumnWidth + 'px',
          scopedSlots: { customRender: 'optButton' }
        })
      }
      return columns
    },
    /**
     * 操作按键点击
     */
    optButtonClick(button, record) {
      if (button.component) {
        this.showoptComponent(button, record)
      } else if (button.click) {
        button.click(record)
      }
    },
    optComponentOk() {
      const component = this.$refs.optComponent
      if (component.getComponentSubmitPromise) {
        component.getComponentSubmitPromise().then(
          data => {
            if (this.optComponentDialog.item.onResult) {
              this.optComponentDialog.item.onResult({ status: 'success', data })
            }
            // this.optComponentDialog.onResult(data)
            this.optComponentDialog.visible = false
          },
          data => {
            if (this.optComponentDialog.item.onResult) {
              this.optComponentDialog.item.onResult({ status: 'error', data })
            }
            // this.optComponentDialog.onResult(data)
          }
        )
      } else {
        this.optComponentDialog.onResult(this.optComponentDialog.resultData)
        this.optComponentDialog.visible = false
        // optComponentDialog.onResult(optComponentDialog.resultData);optComponentDialog.visible=false
      }
    },
    showoptComponent(item, data) {
      this.optComponentDialog.component = item.component
      this.optComponentDialog.resultData = data
      this.optComponentDialog.visible = true
      this.optComponentDialog.item = item
      this.optComponentDialog.title = item.label
      this.optComponentDialog.actionButton =
        item.componentActionButton === undefined ? true : item.componentActionButton
      this.optComponentDialog.width = item.componentWidth || '950px'
      this.optComponentDialog.notify = item.notify
      // this.$nextTick(() => {
      //   // debugger
      //   this.componentDialogWrapHeight = this.$refs.componentDialogWrap.clientHeight
      // })
    }
  },
  updated() {
    if (this.$refs.componentDialogWrap) {
      this.componentDialogWrapHeight = this.$refs.componentDialogWrap.clientHeight
    }
  }
}
</script>

<style >
.xw-table .row-background {
  background: #fafafa;
}
.singleSelect .ant-table-thead .ant-checkbox-wrapper {
  display: none !important;
}
</style>
