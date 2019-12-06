/*
 * @Author: zhangwencan
 * @Date: 2019-09-20 09:40:24
 * @Last Modified by: zhangwencan
 * @Last Modified time: 2019-10-24 14:17:36
  上传
 */

<template>
  <div class="upload-win">
    <div style="padding:20px 10px;">
      <input type="file" @change="readExcel" />
      <a @click="download">模板下载</a>
      <br />
      <div v-if="errorMessage.length>0" style="margin:20px 0px;padding:10px;border:1px red solid;">
        <div
          v-for="(item, index) in showErrorMessage"
          :key="index"
          style="padding:5px;border-bottom:1px solid #EAEAEA"
        >{{item.name}}，{{item.errorInfo}}</div>
      </div>
      <br />
    </div>
    <div style="text-align:right; position:absolute;bottom:0px;right:0px;margin:10px;">
      <a-button type="primary" @click="submit" :disabled="errorMessage.length>0||data.length===0">确定</a-button>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    url: {
      type: String,
      default: '',
      required: true
    },
    templateUrl: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      result: null,
      data: [],
      errorMessage: []
    }
  },
  computed: {
    showErrorMessage() {
      const length = this.errorMessage.length
      const list = this.errorMessage.filter((item, index) => index < 10)
      if (length > 10) {
        list.push({ name: `......有${length}条错误`, errorInfo: '请检查' })
      }
      return list
    }
  },
  created() {},
  methods: {
    download() {
      window.location.href = this.templateUrl
    },
    getComponentValue() {
      return this.result
    },
    readExcel(evt) {
      this.errorMessage = []
      // 表格导入
      var files = evt.target.files

      if (files.length <= 0) {
        // 如果没有文件名
        return false
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$message.error('上传格式不正确，请上传xls或者xlsx格式')
        return false
      }
      console.log(files)
      const fileReader = new FileReader()
      const vm = this
      fileReader.onload = ev => {
        try {
          const data = ev.target.result
          const workbook = XLSX.read(data, {
            type: 'binary'
          })

          this.paramsWorkbook = workbook
          const list = []
          //   for (let i = 0; i < workbook.SheetNames.length; i++) {
          const wsname = workbook.SheetNames[0]
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname])
          /** 解析行 */
          let count = 0
          for (const row of ws) {
            count++
            //   console.log(row)
            const data = {}
            for (const field of vm.fields) {
              const value = row[field.label]
              if (field.required && !value) {
                vm.errorMessage.push({ name: field.label, errorInfo: `格式不正确，行${count}` })
              }

              data[field.prop] = row[field.label]
            }

            // const data = {
            //   merBlisName: row.营业执照名称,
            //   merBlisConfirm: row.营业执照号码,
            //   acctNo: row.结算账户,
            //   larIdcard: row.法人身份证,
            //   openningIdcard: row.入账人身份证,
            //   whiteLevel: row.大POS等级,
            //   qcodeWhiteLevel: row.Q码等级,
            //   qcodeElfWhiteLevel: row.Q码精灵等级,
            //   scanCodePayWhiteLevel: row.专业化等级
            // }
            list.push(data)
            // }
          }
          console.log(list)
          this.data = list
        } catch (e) {
          return false
        }
      }
      fileReader.readAsBinaryString(files[0])
    },
    submit() {
      if (this.data.length === 0) {
        this.$message.warning('请正确选择文件')
        return
      }
      this.$http({ url: this.url, method: 'post', data: { list: this.data } })
        .then(data => {
          this.result = data
          if (data.data && data.data.length > 0) {
            this.$message.error('上传数据存在异常')
            this.errorMessage = data.data
            this.$emit('notify')
          } else {
            this.$emit('ok')
          }
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    }
  }
}
</script>

<style lang="less">
.upload-win {
  .ant-form-item-label {
    label {
      width: 80px !important;
    }
  }
}
</style>
