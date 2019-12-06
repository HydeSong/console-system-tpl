/*
 * @Author: zhangwencan
 * @Date: 2019-09-25 09:07:42
 * @Last Modified by:   zhangwencan
 * @Last Modified time: 2019-09-25 09:07:42
  用户选择
 */

<template>
  <div style="background:#f0f2f5">
    <list :config="config" :compact="true" @selectionChange="rows=>selectedRows=rows"></list>
  </div>
</template>

<script>
import list from '@/components/admin/list'

export default {
  components: {
    list
  },
  data() {
    return {
      config: {
        canAdd: false,
        baseUrl: '/user/queryPageList',
        singleSelect: true,
        toolButtonAlign: 'right',
        selectedRows: [],
        filterFields: [
          { label: '用户名', prop: 'usrRealName' },
          { label: '所属部门', prop: 'compOrgName' },
          { label: '员工号', prop: 'usrLoginName' }
        ],
        tableColumns: [
          { label: '用户名', prop: 'usrRealName' },
          { label: '所属部门', prop: 'compOrgName' },
          { label: '员工号', prop: 'usrLoginName' }
        ]
      }
    }
  },
  methods: {
    getComponentValue() {
      return this.selectedRows
    }
  }
}
</script>

<style>
</style>
