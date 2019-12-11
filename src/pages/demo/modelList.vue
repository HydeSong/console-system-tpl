<template>
  <div>
    <list ref="list" :config="config" @selectionChange="rows=>selectedRows=rows" :filter="filter" />
    <a-modal
      v-model="provideDialog.visible"
      width="980px"
      style="top:20px;"
      @ok="provideDialog.visible=false"
      title="供应商管理"
    >
      <div>
        <list ref="list2" :config="provideDialog.config" :compact="true" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import list from '@/components/admin/list'
import { axios } from '@/utils/request'

export default {
  components: {
    list
  },
  data() {
    // const COL_DEVICETYPEID = { label: '设备类型id', prop: 'deviceTypeId' }
    const COL_DEVICETYPENAME = { label: '设备型号', prop: 'deviceTypeName', required: true, rules: 'maxlength[30]' }
    const COL_DEVICETYPESHORTNAME = {
      label: '设备型号简称',
      prop: 'deviceTypeShortName',
      required: true,
      rules: 'maxlength[30]'
    }
    const COL_DEVICETYPECODE = { label: '设备型号代码', prop: 'deviceTypeCode', required: true, rules: 'maxlength[30]' }
    const COL_DEVICEPROVIDER = {
      label: '供应商',
      prop: 'deviceProvider',
      choice: () =>
        axios({
          url: '/device/providers/queryList',
          method: 'post'
        }).then(data => {
          return Promise.resolve(
            data.data.map(item => {
              return { label: item.deviceProviderName, value: item.deviceProviderId }
            })
          )
        }),
      formatter(value) {
        return { deviceProviderId: value }
      }
    }
    const COL_DEVICEKIND = {
      label: '设备类型',
      prop: 'deviceKind',
      choice: [
        { value: 4, label: '主机' },
        { value: 5, label: 'PIN' },
        { value: 6, label: '耗材' },
        { value: 7, label: '电源' },
        { value: 8, label: 'SIM卡' }
      ],
      required: true
    }
    const COL_STATUS = {
      label: '状态',
      prop: 'rowStatus',
      choice: [{ label: '有效', value: 'VALID' }, { label: '无效', value: 'INVALID' }],
      render(h, text) {
        if (text === 'INVALID') {
          return <a-icon type="close-circle" style="color:red" />
        } else {
          return <a-icon type="check-circle" style="color:green" />
        }
      }
    }
    const vm = this

    const COL_DEVICEPROVIDERNAME = { label: '供应商名称', prop: 'deviceProviderName', required: true }
    const COL_DEVICEPROVIDERSHORTNAME = { label: '供应商简称', prop: 'deviceProviderShortName', required: true }
    const COL_DEVICEPROVIDERCODE = { label: '供应商代码', prop: 'deviceProviderCode', required: true }
    const COL_DEVICEPROVIDERCONTACT = { label: '供应商联系人', prop: 'deviceProviderContact', required: true }
    const COL_DEVICEPROVIDERADDR = { label: '供应商地址', prop: 'deviceProviderAddr', required: true }
    const COL_DEVICEPROVIDERZIPCODE = { label: '供应商邮编', prop: 'deviceProviderZipcode', required: true }
    const COL_DEVICEPROVIDERTELE = { label: '供应商电话', prop: 'deviceProviderTele', required: true }
    const COL_DEVICEPROVIDERFAX = { label: '供应商传真', prop: 'deviceProviderFax', required: true }
    const COL_DEVICEPROVIDEREMAIL = { label: '供应商邮件', prop: 'deviceProviderEmail', rules: 'email', required: true }
    // const COL_ROWSTATUS = { label: '状态', prop: 'rowStatus' }
    // const COL_OWSNOVARCHAR = { label: '请求流水号', prop: 'owSnovarchar' }
    // const COL_ROWLASTMODIFYUSER = { label: '最后修改人', prop: 'rowLastModifyUser' }
    // const COL_ROWVERNO = { label: '版本号', prop: 'rowVerNo' }
    return {
      selectedRows: [], // 被选中行
      config: {
        name: '设备型号管理',
        // 列表显示配置
        tableColumns: [
          COL_DEVICEKIND,
          COL_DEVICETYPENAME,
          COL_DEVICETYPESHORTNAME,
          COL_DEVICETYPECODE,
          {
            label: '供应商',
            prop: 'deviceProvider',
            formatter(val, row) {
              return val ? val.deviceProviderName : '--'
              // return val.deviceProviderName || ''
            }
          },
          COL_STATUS
        ],
        canDelete: false,
        canEdit: true,
        canAdd: true,
        defaultQuery: false,
        // 过滤条件配置
        filterFields: [COL_DEVICETYPENAME, COL_DEVICEKIND, COL_DEVICEPROVIDER, COL_STATUS],
        // 编辑form配置,
        editStyle: 'edit2',
        editFields: [
          COL_DEVICEKIND,
          COL_DEVICETYPENAME,
          COL_DEVICETYPECODE,
          COL_DEVICETYPESHORTNAME,
          {
            label: '供应商',
            prop: 'deviceProviderId',
            choice: () =>
              axios({
                url: '/device/providers/queryList',
                method: 'post'
              }).then(data => {
                return Promise.resolve(
                  data.data.map(item => {
                    return { label: item.deviceProviderName, value: item.deviceProviderId }
                  })
                )
              })
            // formatter(value) {
            //   return { deviceProviderId: value }
            // }
          }
          // {
          //   prop: 'deviceProvider',
          //   type: 'hidden',
          //   bind: {
          //     path: 'deviceProviderId',
          //     objKey: 'deviceProviderId'
          //   }
          // }
        ],
        beforeEdit(form) {
          if (form.deviceProvider) {
            vm.$set(form, 'deviceProviderId', form.deviceProvider.deviceProviderId)
            // form.deviceProviderId = form.deviceProvider.deviceProviderId
          }
        },
        getTableUrl() {
          return '/device/types/queryPageList'
        },
        saveUrl: '/device/types/saveTypes',
        updateUrl: '/device/types/updateTypes',
        beforeSubmit(form) {
          delete form.rowCreateTm
          delete form.rowLastModifyTm
          form.deviceProvider = { deviceProviderId: form.deviceProviderId }
        },
        toolButtons: [
          // 工具栏按键
          {
            label: '供应商管理',
            icon: 'team',
            click(row) {
              vm.provideDialog.visible = true
            }
          },
          {
            label: '启用',
            icon: 'check',
            click(row) {
              if (vm.selectedRows.length === 0) {
                vm.$message.warn('请选择记录')
                return
              }
              vm.$confirm({
                title: '系统提示',
                content: `确认设置选中的${vm.selectedRows.length}条数据为启用状态？`,
                onOk() {
                  vm.$http({
                    url: '/device/types/updateStatusByBatch',
                    method: 'post',
                    data: {
                      ids: vm.selectedRows.map(item => item.deviceTypeId).join(','),
                      rowStatus: 'VALID'
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
            label: '停用',
            icon: 'stop',
            click(row) {
              if (vm.selectedRows.length === 0) {
                vm.$message.warn('请选择记录')
                return
              }
              vm.$confirm({
                title: '系统提示',
                content: `确认设置选中的${vm.selectedRows.length}条数据为停用状态？`,
                onOk() {
                  vm.$http({
                    url: '/device/types/updateStatusByBatch',
                    method: 'post',
                    data: {
                      ids: vm.selectedRows.map(item => item.deviceTypeId).join(','),
                      rowStatus: 'INVALID'
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
        optButton: []
      },
      provideDialog: {
        visible: false,
        config: {
          // 列表显示配置
          name: '供应商',
          tableColumns: [
            COL_DEVICEPROVIDERNAME,
            COL_DEVICEPROVIDERSHORTNAME,
            COL_DEVICEPROVIDERCODE,
            COL_DEVICEPROVIDERCONTACT,
            COL_DEVICEPROVIDERADDR,
            COL_DEVICEPROVIDERZIPCODE,
            COL_DEVICEPROVIDERTELE,
            COL_DEVICEPROVIDERFAX,
            COL_DEVICEPROVIDEREMAIL
          ],
          canDelete: false,
          canEdit: true,
          canAdd: true,
          // 过滤条件配置
          filterFields: [COL_DEVICEPROVIDERNAME],
          beforeSubmit(formData) {
            delete formData.rowCreateTm
          },
          // 编辑form配置
          editFields: [
            COL_DEVICEPROVIDERNAME,
            COL_DEVICEPROVIDERSHORTNAME,
            COL_DEVICEPROVIDERCODE,
            COL_DEVICEPROVIDERCONTACT,
            COL_DEVICEPROVIDERADDR,
            COL_DEVICEPROVIDERZIPCODE,
            COL_DEVICEPROVIDERTELE,
            COL_DEVICEPROVIDERFAX,
            COL_DEVICEPROVIDEREMAIL
          ],
          getTableUrl() {
            return '/device/providers/queryPageList'
          },
          saveUrl: '/device/providers/saveSupplier',
          updateUrl: '/device/providers/updateSupplier',
          toolButtons: [
            // 工具栏按键
          ]
        }
      }
    }
  },
  watch: {
    'provideDialog.visible'(v) {
      if (!v) {
        this.$refs.list.reloadFilterChoice()
      }
    }
  },
  computed: {
    filter() {
      return {}
    }
  },
  methods: {}
}
</script>

<style>
</style>
