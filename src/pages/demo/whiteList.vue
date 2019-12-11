<!--
 * @Author: zhangwc
 * @Date: 2019-08-21 09:17:34
 * @LastEditors: zhangwc
 * @LastEditTime: 2019-08-22 19:40:47
 * @Description: 设备白名单
 -->
<template>
  <div>
    <list ref="list" :config="config" @selectionChange="rows=>selectedRows=rows" />
  </div>
</template>

<script>
import list from '@/components/admin/list'

export default {
  components: {
    list
  },
  data() {
    // const COL_ROWSTATUS = { label: '状态', prop: 'rowStatus' }
    // const COL_ROWSNO = { label: '流水号', prop: 'rowSno' }
    // const COL_ROWCREATETM = { label: '创建时间', prop: 'rowCreateTm' }
    // const COL_ROWCREATEUSER = { label: '创建人', prop: 'rowCreateUser' }
    // const COL_ROWLASTMODIFYTM = { label: '最后修改时间', prop: 'rowLastModifyTm' }
    // const COL_ROWLASTMODIFYUSER = { label: '最后修改人', prop: 'rowLastModifyUser' }
    // const COL_ROWVERNO = { label: '版本号', prop: 'rowVerNo' }
    const COL_COMPORGID = { label: '机构号', prop: 'compOrgId', required: true }
    const COL_COMPORGNAME = { label: '机构名称', prop: 'compOrgName', required: true }
    // const COL_FILEURL = { label: '文件路径', prop: 'fileUrl' }
    const vm = this
    return {
      selectedRows: [], // 被选中行
      config: {
        name: '激活机构白名单管理',
        // 列表显示配置
        tableColumns: [COL_COMPORGID, COL_COMPORGNAME],
        canDelete: true,
        canEdit: false,
        canAdd: true,
        defaultQuery: false,
        // 过滤条件配置
        filterFields: [COL_COMPORGID, COL_COMPORGNAME],
        // 编辑form配置
        editFields: [COL_COMPORGID, COL_COMPORGNAME],
        getTableUrl() {
          return '/device/white/queryPaging'
        },
        saveUrl: '/device/white/save',
        updateUrl: '/device/ver/update',
        toolButtons: [
          // 工具栏按键
          // {
          //   label: '导入',
          //   icon: 'upload',
          //   click(row) {}
          // },
          {
            label: '批量导入',
            componentWidth: '500px',
            // componentActionButton: false,
            component: require('@/components/admin/uploadExcel/fileModel').default,
            templateUrl: process.env.VUE_APP_CONTEXT + 'templates/whitelist-upload.xls',

            doUpload(path) {
              return vm
                .$http({
                  url: '/device/white/uploadFile',
                  method: 'post',
                  data: {
                    filePath: path,
                    operator: 1
                  }
                })
                .then(data => {
                  vm.$message.info(data.message)
                  vm.$refs.list.resultTable.reload()
                  return Promise.resolve()
                })
                .catch(data => {
                  vm.$message.info('提交出错')
                  return Promise.reject(new Error('提交出错'))
                })
            }
          },
          {
            label: '删除',
            icon: 'delete',
            click(row) {
              if (vm.selectedRows.length === 0) {
                vm.$message.warn('请选择数据')
                return
              }
              vm.$confirm({
                title: '系统提示',
                content: `确认删除选中的${vm.selectedRows.length}条数据？`,
                onOk() {
                  vm.$http({
                    url: '/device/white/deleteBatch',
                    method: 'post',
                    data: {
                      ids: vm.selectedRows.map(item => item.compOrgId).join(','),
                      operator: 1
                    }
                  }).then(data => {
                    vm.$refs.list.resultTable.reload()
                    vm.$message.info('操作成功')
                  })
                },
                onCancel() {}
              })
            }
          }
        ],
        optButton: [
          // table row 按键
          //   {
          //     label: '启用',
          //     disabled(row) {
          //       return row.rowStatus === 'VALID'
          //     },
          //     click(row) {
          //       vm.$router.push({ name: 'collect', params: row })
          //     }
          //   }
        ]
      }
    }
  }
}
</script>

<style>
</style>
