<template>
  <a-form layout="inline">
    <a-form-item label="业务类别">
      <a-radio-group v-model="type">
        <a-radio value="SNO_QUERY">按序列号</a-radio>
        <a-radio value="TNO_QUERY">按终端号</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item>
      <a :href="context+'templates/batch-query.zip'">模板下载</a>
    </a-form-item>

    <a-form-item label="文件" style="width:400px;">
      <a-upload
        name="file"
        :multiple="false"
        action="/mmsweb/attach/attachUpload"
        @change="handleChange"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      >
        <a-button>
          <a-icon type="upload" />选择上传文件
        </a-button>
      </a-upload>
    </a-form-item>
    <br />
    <!-- {{resultLink}} -->
    <div v-if="result.data&&result.data.resultFilePath">
      查询结果：
      <a :href="resultLink">{{result.data.resultFilePath}}</a>
      <br />
    </div>
    <div v-if="result.data&&result.data.errFilePath">
      错误信息：
      <a :href="errorLink">{{ result.data.errFilePath }}</a>
    </div>
  </a-form>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      path: null,
      type: 'SNO_QUERY',
      resultLink: null,
      errorLink: null,
      context: process.env.VUE_APP_CONTEXT,
      result: {}
    }
  },
  methods: {
    getComponentValue() {
      return null
    },
    getComponentSubmitPromise() {
      // const vm = this
      if (!this.path) {
        this.$message.error('请选择文件')
        return Promise.reject(new Error())
      }
      return this.$http({
        url: '/device/active/queryByImport',
        method: 'post',
        data: {
          filePath: this.path,
          bizCode: this.type
        }
      })
        .then(data => {
          // debugger
          // vm.resultLink = location.origin // + '/mmsweb/attach/downLoadAttach?fileName=result.xls&storePath=' + data.data.resultFilePath

          // return Promise.reject(new Error())
          throw data
        })
        .catch(data => {
          if (data.data) {
            this.result = data
            this.resultLink =
              location.origin +
              '/mmsweb/attach/downLoadAttach?fileName=result.xls&storePath=' +
              data.data.resultFilePath
            this.errorLink =
              location.origin + '/mmsweb/attach/downLoadAttach?fileName=error.xls&storePath=' + data.data.errFilePath
          }
          return Promise.reject(new Error())
          //   this.$message.error(data.message)
          //   if (data.data.errFilePath) {
          //     location.href =
          //       location.origin + '/mmsweb/attach/downLoadAttach?fileName=error.xls&storePath=' + data.data.errFilePath
          //   }
          //   if (data.data.resultFilePath) {
          //     setTimeout(() => {
          //       location.href =
          //         location.origin +
          //         '/mmsweb/attach/downLoadAttach?fileName=result.xls&storePath=' +
          //         data.data.resultFilePath
          //     }, 300)
          //   }
        })
    },
    handleChange(info) {
      this.path = null
      if (info.file.status === 'done') {
        if (info.file.response.code !== '000000') {
          this.$message.error(info.file.response.message)
          return
        }
        console.log(info.file.response.data.path)

        this.path = info.file.response.data.path
        this.$message.info(`${info.file.name} 上传完成，点击确认完成操作`)
      }
    },
    sumbit() {
      this.$http({
        url: '/device/active/queryByImport',
        method: 'post',
        data: {
          filePath: this.path,
          bizCode: this.type
        }
      })
        .then(data => {
          this.$message.info(data.message)
          if (data.code === '000000') {
            // this.$refs.list.resultTable.reload()
            this.visible = false
          }
        })
        .catch(data => {
          // this.$message.error(data.message)
          // if (data.data.errFilePath) {
          //   location.href =
          //     location.origin + '/mmsweb/attach/downLoadAttach?fileName=error.xls&storePath=' + data.data.errFilePath
          // }
          // if (data.data.resultFilePath) {
          //   setTimeout(() => {
          //     location.href =
          //       location.origin +
          //       '/mmsweb/attach/downLoadAttach?fileName=result.xls&storePath=' +
          //       data.data.resultFilePath
          //   }, 300)
          // }
        })
    }
  }
}
</script>

<style>
</style>
