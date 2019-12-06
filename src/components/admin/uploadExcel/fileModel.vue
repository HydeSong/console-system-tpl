<template>
  <div>
    <div style="padding:20px 10px 40px;">
      <a-form layout="inline">
        <a-form-item label="文件">
          <a-upload
            name="file"
            :multiple="false"
            action="/mmsweb/attach/attachUpload"
            @change="handleChange"
          >
            <a-button>
              <a-icon type="upload" />选择上传文件
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item>
          <a @click="download">模板下载</a>
        </a-form-item>
      </a-form>
    </div>
    <div
      v-if="meta.componentActionButton===false"
      style="text-align:right; position:absolute;bottom:5px;right:5px;margin:10px;"
    >
      <a-button type="primary" :disabled="!path" @click="submit">确定</a-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['meta'],
  data() {
    return {
      result: null,
      path: '',
      data: [],
      errorMessage: []
    }
  },
  methods: {
    handleChange(info) {
      this.path = null
      if (info.file.status === 'done') {
        console.log(info.file.response.data.path)
        this.path = info.file.response.data.path
        this.$message.info(`${info.file.name} 上传完成，点击确认完成操作`)
      }
    },
    getComponentValue() {
      return null
    },
    download() {
      if (this.meta.templateUrl) {
        window.location.href = this.meta.templateUrl
      } else {
        this.$message.error('templateUrl 未指定')
      }
    },
    getComponentSubmitPromise() {
      if (this.meta.doUpload) {
        const promise = this.meta.doUpload(this.path)
        if (promise instanceof Promise) {
          return promise
        } else {
          this.$message.error('上传回调应返回Promise')
        }
      } else {
        this.$message.error('请指定【doUpload】进行上传动作实现')
      }
      return Promise.reject(new Error('上传出错'))
    },
    submit() {
      if (this.meta.doUpload) {
        const promise = this.meta.doUpload(this.path)
        if (promise instanceof Promise) {
          promise
            .then(data => {
              this.$emit('ok')
            })
            .catch(data => {})
        } else {
          this.$message.error('上传回调应返回Promise')
        }
      } else {
        this.$message.error('请指定【doUpload】进行上传动作实现')
      }
    }
  }
}
</script>

<style>
</style>
