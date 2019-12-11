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

    <a-modal
      v-model="uploadDialog2.visible"
      class="admin-dialog"
      title="导入标识"
      @ok="uploadDialog2.sumbit"
    >
      <a-form layout="inline">
        <a-form-item label="文件">
          <a-upload
            name="file"
            :multiple="false"
            action="/mmsweb/attach/attachUpload"
            @change="uploadDialog2.handleChange"
          >
            <a-button>
              <a-icon type="upload" />选择上传文件
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item>
          <a :href="context+'templates/control-label.xls'">模板下载</a>
        </a-form-item>
      </a-form>
      <div slot="footer">
        <a-button @click="uploadDialog2.visible=false">取消</a-button>
        <a-button :disabled="!uploadDialog2.path" type="primary" @click="uploadDialog2.sumbit">确定</a-button>
      </div>
    </a-modal>
    <!-- <a-modal v-model="uploadDialog3.visible" title="批量查询" @ok="uploadDialog3.sumbit">
      <a-form layout="inline">
        <a-form-item label="业务类别" :label-col="3">
          <a-radio-group v-model="uploadDialog3.type">
            <a-radio value="SNO_QUERY">按序列号</a-radio>
            <a-radio value="TNO_QUERY">按终端号</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item>
          <a :href="context+'templates/batch-query.zip'">模板下载</a>
        </a-form-item>
        <a-form-item label="文件">
          <a-upload
            name="file"
            :multiple="false"
            action="/mmsweb/attach/attachUpload"
            @change="uploadDialog3.handleChange"
          >
            <a-button>
              <a-icon type="upload" />选择上传文件
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>-->
  </div>
</template>

<script>
import list from '@/components/admin/list'
import Vue from 'vue'
export default {
  components: {
    list
  },
  data() {
    const COL_DEVICESERIALNO = { label: '设备序列号', prop: 'deviceSerialNo' }
    const COL_SHOPNO = { label: '商户号', prop: 'shopNo' }
    const COL_TERMNO = { label: '终端号', prop: 'termNo' }
    // const COL_ACTIVEPLATFORM = { label: '激活平台', prop: 'activePlatform' }
    const COL_BATCHNO = { label: '批次号', prop: 'batchNo' }

    // const COL_COERCEUNACTIVENUM = { label: '强制反激活次数', prop: 'coerceUnActiveNum' }
    const COL_COMPANYNAME = { label: '厂商', prop: 'companyName' }
    const COL_DEVICETYPE = { label: '机型', prop: 'deviceType' }
    // const COL_VERCTRL = { label: '版本是否管控', prop: 'verCtrl' }
    // const COL_FILEURL = { label: '原文件路径', prop: 'fileUrl' }
    const COL_COMPORGNAME = { label: '机构名称', prop: 'compOrgName' }
    const COL_MONTHACTIVENUM = { label: '月激活次数', prop: 'monthActiveNum' }
    const COL_ROWCREATETM = { label: '创建时间', prop: 'rowCreateTm' }
    // const COL_ROWCREATEUSER = { label: '创建人', prop: 'rowCreateUser' }
    // const COL_ROWLASTMODIFYTM = { label: '最后修改时间', prop: 'rowLastModifyTm' }
    // const COL_ROWSTATUS = { label: '状态', prop: 'rowStatus' }
    // const COL_ROWSNOVARCHAR = { label: '请求流水号', prop: 'rowSnovarchar' }
    // const COL_ROWLASTMODIFYUSER = { label: '最后修改人', prop: 'rowLastModifyUser' }
    // const COL_ROWVERNO = { label: '版本号', prop: 'rowVerNo' }

    const COL_COMPORGID = {
      label: '机构号',
      prop: 'compOrgId',
      formatter(data) {
        const { orgId, orgName } = data
        return { label: orgName, value: orgId }
      },
      component: require('@/components/a-selects/org').default
    }

    const COL_ACTIVESTATUS = {
      label: '激活状态',
      prop: 'activeStatus',
      choice: [{ label: '已激活', value: '1' }, { label: '未激活', value: '0' }],
      render(h, text, record, index) {
        if (text === '1') {
          return <a-icon type="check-circle" style="color:green" />
        } else {
          return <a-icon type="close-circle" style="color:red" />
        }
      }
    }
    const COL_UNACTIVEABLE = {
      label: '允许反激活',
      prop: 'unActiveAble',
      render(h, text, record, index) {
        if (text === '1') {
          return <a-icon type="check-circle" style="color:green" />
        } else {
          return <a-icon type="close-circle" style="color:red" />
        }
      }
    }
    const vm = this
    return {
      context: process.env.VUE_APP_CONTEXT,
      templateUrl: process.env.VUE_APP_CONTEXT + 'templates/serial-number-import.xls',
      selectedRows: [], // 被选中行
      config: {
        name: '设备序列号管理',
        defaultQuery: false,
        // 列表显示配置
        tableColumns: [
          COL_DEVICESERIALNO,
          COL_BATCHNO,
          COL_ACTIVESTATUS,
          COL_UNACTIVEABLE,
          COL_SHOPNO,
          COL_TERMNO,
          COL_COMPANYNAME,
          COL_DEVICETYPE,
          COL_COMPORGNAME,
          COL_MONTHACTIVENUM,
          COL_ROWCREATETM
        ],
        canDelete: false,
        canEdit: false,
        canAdd: false,
        // 过滤条件配置
        filterFields: [COL_DEVICESERIALNO, COL_SHOPNO, COL_TERMNO, COL_BATCHNO, COL_ACTIVESTATUS, COL_COMPORGID],
        // 编辑form配置
        editFields: [COL_SHOPNO, COL_DEVICESERIALNO, COL_TERMNO, COL_BATCHNO, COL_ACTIVESTATUS, COL_COMPORGID],
        getTableUrl() {
          return '/device/active/queryPaging'
        },
        saveUrl: '/device/types/saveTypes',
        updateUrl: '/device/types/updateTypes',
        beforeSubmit(form) {
          delete form.rowCreateTm
          delete form.rowLastModifyTm
        },
        toolButtons: [
          // 工具栏按键
          {
            label: '批量导入',
            icon: 'upload',
            click(row) {
              vm.uploadDialog.visible = true
            }
          },
          {
            label: '允许反激活',
            icon: 'check',
            click(row) {
              vm.$http({
                url: '/device/active/allowUnActive',
                method: 'post',
                data: {
                  ids: vm.selectedRows.map(item => item.deviceActiveId).join(','),
                  operator: 1
                }
              }).then(data => {
                vm.$refs.list.resultTable.reload()
                vm.$message.info('操作成功')
              })
            }
          },
          {
            label: '不允许反激活',
            icon: 'stop',
            click(row) {
              vm.$http({
                url: '/device/active/notAllowUnActive',
                method: 'post',
                data: {
                  ids: vm.selectedRows.map(item => item.deviceActiveId).join(','),
                  operator: 1
                }
              }).then(data => {
                vm.$refs.list.resultTable.reload()
                vm.$message.info('操作成功')
              })
            }
          },
          // {
          //     label: '强制反激活 ',
          //     icon: 'check',
          //     click(row) {}
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
                    url: '/device/active/deleteBatch',
                    method: 'post',
                    data: {
                      ids: vm.selectedRows.map(item => item.deviceActiveId).join(','),
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
          // {
          //     label: '全部删除',
          //     icon: 'delete',
          //     click(row) {}
          // },
          // {
          //   label: '导入管控标识',
          //   icon: 'upload',
          //   click(row) {
          //     vm.uploadDialog2.visible = true
          //   }
          // },
          {
            label: '批量查询',
            icon: 'search',
            component: require('./serialBatchQuery').default,
            componentWidth: '560px'
            // click(row) {
            //   vm.uploadDialog3.visible = true
            // }
          }
        ],
        optButton: [
          // table row 按键
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
            url: '/device/active/importSno',
            method: 'post',
            data: {
              filePath: vm.uploadDialog.path,
              operator: 1
            }
          })
            .then(data => {
              vm.$message.info(data.message)
              vm.$refs.list.resultTable.reload()
              vm.uploadDialog.loading = false
              vm.uploadDialog.visible = false
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
      // 导入标识
      uploadDialog2: {
        visible: false,
        path: null,

        handleChange(info) {
          vm.uploadDialog2.path = null
          if (info.file.status === 'done') {
            if (info.file.response.code !== '000000') {
              vm.$message.error(info.file.response.message)
              return
            }
            console.log(info.file.response.data.path)

            vm.uploadDialog2.path = info.file.response.data.path
            vm.$message.info(`${info.file.name} 上传完成，点击确认完成操作`)
          }
        },
        sumbit() {
          vm.$http({
            url: '/device/active/importVerCtrl',
            method: 'post',
            data: {
              filePath: vm.uploadDialog2.path,
              operator: 1
            }
          })
            .then(data => {
              vm.$message.info(data.message)
              if (data.code === '000000') {
                vm.$refs.list.resultTable.reload()
                vm.uploadDialog2.visible = false
              }
            })
            .catch(data => {
              vm.$message.error(data.message)
              location.href =
                location.origin + '/mmsweb/attach/downLoadAttach?fileName=error.xls&storePath=' + data.data
            })
        }
      }
      // 批量查询
      // uploadDialog3: {
      //   visible: false,
      //   path: null,
      //   type: 'SNO_QUERY',
      //   resultLink: null,

      //   handleChange(info) {
      //     vm.uploadDialog3.path = null
      //     if (info.file.status === 'done') {
      //       console.log(info.file.response.data.path)

      //       vm.uploadDialog3.path = info.file.response.data.path
      //       vm.$message.info(`${info.file.name} 上传完成，点击确认完成操作`)
      //     }
      //   },
      //   sumbit() {
      //     vm.$http({
      //       url: '/device/active/queryByImport',
      //       method: 'post',
      //       data: {
      //         filePath: vm.uploadDialog3.path,
      //         bizCode: vm.uploadDialog3.type
      //       }
      //     })
      //       .then(data => {
      //         vm.$message.info(data.message)
      //         if (data.code === '000000') {
      //           // vm.$refs.list.resultTable.reload()
      //           vm.uploadDialog3.visible = false
      //         }
      //       })
      //       .catch(data => {
      //         vm.$message.error(data.message)
      //         if (data.data.errFilePath) {
      //           location.href =
      //             location.origin +
      //             '/mmsweb/attach/downLoadAttach?fileName=error.xls&storePath=' +
      //             data.data.errFilePath
      //         }
      //         if (data.data.resultFilePath) {
      //           setTimeout(() => {
      //             location.href =
      //               location.origin +
      //               '/mmsweb/attach/downLoadAttach?fileName=result.xls&storePath=' +
      //               data.data.resultFilePath
      //           }, 300)
      //         }
      //       })
      //   }
      // }
    }
  },
  methods: {
    test() {
      const vnode = (
        <a-modal title="Title" v-visible="true">
          {' '}
          <p>test</p>
        </a-modal>
      )
      debugger
      // vnode.vm = vnode.$mount()
      // 用原生DOM API把它插入body中
      const inst = Vue.extend(vnode)
      inst.vm = inst.$mount()
      document.body.appendChild(inst.$el)
      return vnode
    }
  }
}
</script>

<style>
</style>
