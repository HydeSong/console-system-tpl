/*
 * @Author: zhangwencan
 * @Date: 2019-09-25 09:07:42
 * @Last Modified by: zhangwencan
 * @Last Modified time: 2019-10-22 19:37:08
  银行选择
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
        baseUrl: '/bank/queryPageList',
        singleSelect: true,
        toolButtonAlign: 'right',
        selectedRows: [],
        filterFields: [
          {
            label: '银行区域码',
            prop: 'districtCode',
            customView: require('@/components/a-form-views/addrCode').default
          },
          { label: '开户行名称', prop: 'bankName' },
          {
            label: '银行种类',
            prop: 'bankTypeCode',
            choice: [
              {
                label: '中国工商银行',
                value: '102'
              },
              {
                label: '中国农业银行',
                value: '103'
              },
              {
                label: '中国银行',
                value: '104'
              },
              {
                label: '中国建设银行',
                value: '105'
              },
              {
                label: '交通银行',
                value: '301'
              },
              {
                label: '中信银行',
                value: '302'
              },
              {
                label: '光大银行',
                value: '303'
              },
              {
                label: '华夏银行',
                value: '304'
              },
              {
                label: '中国民生银行',
                value: '305'
              },
              {
                label: '广东发展银行',
                value: '306'
              },
              {
                label: '深圳发展银行',
                value: '307'
              },
              {
                label: '招商银行',
                value: '308'
              },
              {
                label: '兴业银行',
                value: '309'
              },
              {
                label: '上海浦东发展银行',
                value: '310'
              },
              {
                label: '其它城市商业银行',
                value: '313'
              },
              {
                label: '恒丰银行',
                value: '315'
              },
              {
                label: '浙商银行',
                value: '316'
              },
              {
                label: '渤海银行',
                value: '318'
              },
              {
                label: '徽商银行',
                value: '319'
              },
              {
                label: '城市信用社',
                value: '401'
              },
              {
                label: '中国邮政储蓄银行',
                value: '403'
              },
              {
                label: '汇丰银行',
                value: '501'
              }
            ]
          }
        ],
        tableColumns: [
          {
            label: '支行名称',
            prop: 'bankName'
          },
          {
            label: '开户行号',
            prop: 'openningBankCode'
          },
          {
            label: '清算行号',
            prop: 'clearingBankCode'
          }
        ]
      }
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
