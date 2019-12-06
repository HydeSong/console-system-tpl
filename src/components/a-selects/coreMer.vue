<template>
  <div>
    <list
      ref="list"
      :config="config"
      :filter="filter"
      :compact="true"
      @selectionChange="rows=>selectedRows=rows"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectedRows: [],
      config: {
        name: '名称',
        // 列表显示配置
        tableColumns: [
          { label: '内部商户号', prop: 'merInnerNo' },
          { label: '商户注册名称', prop: 'merRegName' },
          { label: '商户经营名称', prop: 'merOptName' },
          { label: '法人姓名', prop: 'larName' }
        ],
        canDelete: false,
        canEdit: false,
        canAdd: false,
        // 过滤条件配置
        filterFields: [
          { label: '内部商户号', prop: 'merInnerNo' },
          { label: '商户注册名称', prop: 'merRegName' },
          { label: '营业执照号码', prop: 'merBlis' }
        ],
        // 编辑form配置
        editFields: [],
        baseUrl: '/coreMer/queryPageList',
        saveUrl: '',
        updateUrl: '',
        singleSelect: true,
        toolButtons: [],
        optButton: [
          // table row 按键
        ]
      }
    }
  },
  computed: {
    filter() {}
  },
  methods: {
    getComponentValue() {
      return this.selectedRows.length > 0 ? this.selectedRows[0] : {}
    }
  }
}
</script>

<style>
</style>
