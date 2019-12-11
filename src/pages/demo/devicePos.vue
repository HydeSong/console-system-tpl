<template>
  <div>
    <list ref="list" :config="config" @selectionChange="rows=>selectedRows=rows" />
    <a-modal v-model="uploadDialog.visible" title="批量导入" @close="()=>uploadDialog.path = null">
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
          <a :href="templateUrl">模板下载</a>
        </a-form-item>
      </a-form>
      <div slot="footer">
        <a-button @click="uploadDialog.visible=false">取消</a-button>
        <a-button
          :loading="uploadDialog.loading"
          :disabled="!uploadDialog.path"
          type="primary"
          @click="uploadDialog.sumbit"
        >确定</a-button>
      </div>
    </a-modal>
    <a-modal v-model="settingDialog.visible" width="900px" title="设置下载次数">
      <div>
        <list ref="list2" :config="settingDialog.config" :compact="true" />
      </div>
    </a-modal>
    <a-modal v-model="settingEditDialog.visible" title="母POS秘钥下载配置">
      <div>
        {{ settingEditDialog.data }}
        <a-form>
          <a-form-item label="机构" />
        </a-form>
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
    const COL_ROWCREATETM = { label: '创建时间', prop: 'rowCreateTm' }
    const COL_ROWCREATEUSER = { label: '创建人', prop: 'rowCreateUserName' }
    const COL_ROWLASTMODIFYTM = { label: '最后修改时间', prop: 'rowLastModifyTm' }
    const COL_ROWLASTMODIFYUSER = { label: '最后修改人', prop: 'rowLastModifyUserName' }
    // const COL_ROWVERNO = { label: '版本号', prop: 'rowVerNo' }
    // const COL_ID = { label: '记录id', prop: 'id' }
    const COL_DEVICETYPE = { label: '设备型号', prop: 'deviceType', required: true }
    const COL_DEVICESERIALNO = { label: '设备序列号', prop: 'deviceSerialNo', readonly: true, required: true }
    const COL_COMPORG = {
      label: '所属机构',
      prop: 'compOrg',
      showProp: 'compOrgName',
      formatter(data) {
        const { orgId, orgName } = data
        return { label: orgName, value: orgId }
      },
      component: require('@/components/a-selects/org').default,
      required: true
    }
    const COL_POSTYPE = { label: '母pos类别', prop: 'posType', required: true }
    const COL_DEVICEPROVIDERNAME = { label: '供应商名称', prop: 'deviceProviderName', required: true }
    const COL_ORGNAME = { label: '机构名称', prop: 'compOrgName', required: true }

    //
    const COL_DEVICEPROVIDER = {
      label: '供应商',
      prop: 'deviceProviderName',
      choice: () =>
        this.$http({
          url: '/device/providers/queryList',
          method: 'post'
        }).then(data => {
          return Promise.resolve(
            data.data.map(item => {
              return { label: item.deviceProviderName, value: item.deviceProviderName }
            })
          )
        })
    }
    const vm = this

    // const COL_ROWSTATUS = {label:'状态',prop:'rowStatus'}
    const COL_DOWNLOADSKEYTOTAL = { label: '密钥下载总数', prop: 'downloadSkeyTotal', type: 'num', required: true }
    const COL_DOWNLOADSKEYCOUNT = { label: '已经下载数', prop: 'downloadSkeyCount', type: 'num', required: true }
    return {
      templateUrl: process.env.VUE_APP_CONTEXT + 'templates/mpos-import.xls',
      selectedRows: [],
      config: {
        name: '母POS信息管理',
        // 列表显示配置
        tableColumns: [
          COL_DEVICEPROVIDERNAME,
          COL_DEVICETYPE,
          COL_DEVICESERIALNO,
          COL_POSTYPE,
          COL_ORGNAME,
          COL_ROWCREATETM,
          COL_ROWCREATEUSER,
          COL_ROWLASTMODIFYTM,
          COL_ROWLASTMODIFYUSER
        ],
        canDelete: false,
        canEdit: true,
        canAdd: false,
        defaultQuery: false,
        // 过滤条件配置
        editStyle: 'edit2',
        filterFields: [COL_DEVICEPROVIDER, COL_DEVICETYPE, COL_DEVICESERIALNO, COL_COMPORG],
        // 编辑form配置
        editFields: [
          COL_DEVICESERIALNO,
          COL_DEVICETYPE,
          COL_COMPORG,
          {
            label: '供应商',
            prop: 'deviceProvider',
            choice: () =>
              this.$http({
                url: '/device/providers/queryList',
                method: 'post'
              }).then(data => {
                return Promise.resolve(
                  data.data.map(item => {
                    return { label: item.deviceProviderName, value: item.deviceProviderId }
                  })
                )
              })
          }
        ],
        getTableUrl() {
          return '/device/mpos/queryPaging'
        },
        saveUrl: '/device/skey/save',
        updateUrl: '/device/mpos/update',
        beforeSubmit(form) {
          delete form.rowCreateTm
          delete form.rowLastModifyTm
        },
        toolButtons: [
          // 工具栏按键
          {
            label: '导入',
            icon: 'upload',
            click(row) {
              vm.uploadDialog.visible = true
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
                    url: '/device/mpos/deleteBatch',
                    method: 'post',
                    data: {
                      ids: vm.selectedRows.map(item => item.id).join(','),
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
          },
          {
            label: '设置下载次数',
            icon: 'download',
            click(row) {
              vm.settingDialog.visible = true
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
        loading: false,
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
          vm.uploadDialog.loading = true
          vm.$http({
            url: '/device/mpos/uploadFile',
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
                vm.uploadDialog.path = null
              } else {
                vm.$message.error('上传失败')
              }
              vm.uploadDialog.loading = false
            })
            .catch(data => {
              vm.$message.error(data.message)
              vm.uploadDialog.loading = false
              if (data.data) {
                location.href =
                  location.origin + '/mmsweb/attach/downLoadAttach?fileName=error.xls&storePath=' + data.data
              }
            })
        }
      },
      settingEditDialog: {
        visible: false,
        data: null
      },
      settingDialog: {
        visible: false,
        config: {
          // 列表显示配置
          name: '控制',
          tableColumns: [COL_ORGNAME, COL_DOWNLOADSKEYTOTAL, COL_DOWNLOADSKEYCOUNT, COL_ROWLASTMODIFYTM],
          canDelete: false,
          canEdit: true,
          canAdd: false,
          // 过滤条件配置
          filterFields: [
            {
              label: '机构名称',
              prop: 'compOrg',
              component: require('@/components/a-selects/org').default,
              formatter(data) {
                const { orgId, orgName } = data
                return { label: orgName, value: orgId }
              }
            }
          ],
          beforeSubmit(formData) {
            delete formData.rowCreateTm
          },
          // 编辑form配置
          editFields: [
            {
              label: '所属机构',
              prop: 'compOrg',
              showProp: 'compOrgName',
              formatter(data) {
                const { orgId, orgName } = data
                return { label: orgName, value: orgId }
              },
              component: require('@/components/a-selects/org').default,
              required: true
            },
            COL_DOWNLOADSKEYTOTAL,
            COL_DOWNLOADSKEYCOUNT
          ],
          getTableUrl() {
            return '/device/skey/queryPaging'
          },
          saveUrl: '/device/skey/save',
          updateUrl: '/device/skey/update',
          toolButtons: [
            // 工具栏按键
            {
              label: '添加控制',
              icon: 'plus',
              // component: require('@/components/a-selects/org').default,
              // onResult(data) {
              //   if (data) {
              //     // vm.settingEditDialog.data = data[0]
              //     // vm.settingEditDialog.visible = true
              //     vm.$refs.list2.showEditDialog(false, { compOrg: data.orgId, compOrgName: data.orgName })
              //   }
              // },
              click() {
                vm.$refs.list2.showEditDialog(false, {})
              }
            }
          ]
        }
      }
    }
  }
}
</script>

<style>
</style>
