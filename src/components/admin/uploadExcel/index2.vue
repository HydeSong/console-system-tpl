/*
 * @Author: zhangwencan
 * @Date: 2019-09-20 09:41:24
 * @Last Modified by: zhangwencan
 * @Last Modified time: 2019-11-06 11:07:34
 */

<template>
  <upload
    :fields="fields"
    :url="url"
    :templateUrl="templateUrl"
    @ok="$emit('ok')"
    @notify="$emit('notify')"
  ></upload>
</template>

<script>
import upload from './index'
export default {
  props: ['meta'],
  components: { upload },
  data() {
    return {
      fields: [],
      url: '',
      templateUrl: ''
    }
  },

  created() {
    this.fields = this.meta.uploadFields
    this.url = this.meta.uploadUrl
    this.templateUrl = this.meta.templateUrl
  },
  methods: {
    getComponentValue() {
      return null
    }
  }
}
</script>

<style>
</style>
