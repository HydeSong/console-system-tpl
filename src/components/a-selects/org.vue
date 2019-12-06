/*
 * @Author: zhangwencan
 * @Date: 2019-09-25 09:07:42
 * @Last Modified by: zhangwencan
 * @Last Modified time: 2019-11-27 18:05:37
  机构选择
 */

<template>
  <div style="background:#f0f2f5">
    <list
      :config="config"
      :compact="true"
      :filter="filter"
      @selectionChange="rows=>selectedRows=rows"
    ></list>
  </div>
</template>

<script>
import list from '@/components/admin/list'

export default {
  props: ['meta'],
  components: {
    list
  },
  data() {
    return {
      config: {
        canAdd: false,
        baseUrl: '/org/queryPageList',
        singleSelect: true,
        toolButtonAlign: 'right',
        selectedRows: [],
        filterFields: [
          { label: '机构名称', prop: 'orgName' },
          {
            label: '机构类别',
            prop: 'orgCategory',
            choice: [
              {
                label: '总部',
                value: 'HEAD_QUARTERS'
              },
              {
                label: '分公司',
                value: 'BRANCH_OFFICE'
              },
              {
                label: '营业部',
                value: 'SALES_DEPARTMENT'
              },
              {
                label: '办事处',
                value: 'AGENCY_OFFICE'
              }
            ]
          }
        ],
        tableColumns: [
          {
            label: '机构名称',
            prop: 'orgName'
          },
          {
            label: '上级机构',
            prop: 'orgParentName'
          },
          {
            label: '机构类别',
            prop: 'orgCategoryName'
          }
        ]
      }
    }
  },
  computed: {
    filter() {
      const defaultParams = { status: 'VALID' }
      if (this.meta && this.meta.componentStatus) {
        return Object.assign(defaultParams, { status: this.meta.componentStatus })
      }
      return defaultParams
    }
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
