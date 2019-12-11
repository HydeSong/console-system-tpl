<template>
  <div>
    <list ref="list" :config="config" @selectionChange="rows=>selectedRows=rows" />
    <a-modal v-model="uploadDialog.visible" title="批量导入" @ok="uploadDialog.sumbit">
      <a-form layout="inline">
        <a-form-item label="文件">
          <a-upload
            name="file"
            :multiple="false"
            action="/mmsweb/attach/attachUpload"
            @change="uploadDialog.handleChange"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          >
            <a-button>
              <a-icon type="upload" />选择上传文件
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item>
          <a>模板下载</a>
        </a-form-item>
      </a-form>
      <div slot="footer">
        <a-button @click="uploadDialog.visible=false">取消</a-button>
        <a-button :disabled="!uploadDialog.path" type="primary" @click="uploadDialog.sumbit">确定</a-button>
      </div>
    </a-modal>
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
    // const COL_DEVICETYPEVERID = { label: '版本管控ID', prop: 'deviceTypeVerId' }
    const COL_DEVICEPROVIDER = { label: '厂商', prop: 'deviceProvider', required: true }
    const COL_OSVERSION = { label: '程序版本号', prop: 'osVersion', required: true }
    const COL_SYSVERSION = { label: '底层版本号', prop: 'sysVersion', required: true }
    const vm = this
    return {
      selectedRows: null,
      config: {
        name: '程序版本管控',
        // 列表显示配置
        tableColumns: [COL_DEVICEPROVIDER, COL_OSVERSION, COL_SYSVERSION],
        canDelete: false,
        canEdit: true,
        canAdd: true,
        defaultQuery: false,
        // 过滤条件配置
        filterFields: [COL_DEVICEPROVIDER],
        // 编辑form配置
        editFields: [COL_DEVICEPROVIDER, COL_OSVERSION, COL_SYSVERSION],
        getTableUrl() {
          return '/device/ver/queryPaging'
        },
        saveUrl: '/device/ver/save',
        updateUrl: '/device/ver/update',
        beforeSubmit(form) {
          delete form.rowCreateTm
          delete form.rowLastModifyTm
        },
        toolButtons: [
          // 工具栏按键
          // {
          //     label: '批量导入',
          //     icon: 'upload',
          //     click(row) {
          //         vm.uploadDialog.visible = true
          //     }
          // },
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
                    url: '/device/ver/deleteBatch',
                    method: 'post',
                    data: {
                      ids: vm.selectedRows.map(item => item.deviceTypeVerId).join(',')
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
      },
      uploadDialog: {
        visible: false,
        path: null,
        handleChange(info) {
          vm.uploadDialog.path = null
          if (info.file.status === 'done') {
            if (info.file.response.code !== '000000') {
              vm.$message.error(info.file.response.message)
              vm.uploadDialog.path = null
              return
            }
            console.log(info.file.response.data.path)

            vm.uploadDialog.path = info.file.response.data.path
            vm.$message.info(`${info.file.name} 上传完成，点击确认完成操作`)
          }
        },
        sumbit() {
          vm.$http({
            url: '/device/active/importSno',
            method: 'post',
            data: {
              filePath: vm.uploadDialog.path,
              operator: 1
            }
          })
            .then(data => {
              vm.$message.info(data.message)
              if (data.code === '000000') {
                vm.$refs.list.resultTable.reload()
                vm.uploadDialog.visible = false
              }
            })
            .catch(data => {
              vm.$message.error(data.message)
              if (data.data) {
                location.href =
                  location.origin + '/mmsweb/attach/downLoadAttach?fileName=error.xls&storePath=' + data.data
              }
            })
        }
      }
    }
  }
}
</script>

<style>
</style>
