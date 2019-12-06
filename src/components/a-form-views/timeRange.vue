/*
 * @Author: zhangwencan
 * @Date: 2019-10-11 11:19:30
 * @Last Modified by: zhangwencan
 * @Last Modified time: 2019-10-11 15:50:35
 * 时间区间表单组件
 */

<template>
  <span>
    <a-time-picker
      v-model="start"
      :format="format"
      placeholder
      style="width:85px;"
      @change="change"
    />~
    <a-time-picker v-model="end" :format="format" placeholder style="width:85px;" @change="change" />
  </span>
</template>

<script>
import moment from 'moment'

export default {
  props: ['value', 'meta'],
  data() {
    return {
      format: 'HH:mm',
      start: null,
      startString: '8:00',
      end: null,
      endString: '18:00'
    }
  },
  created() {
    if (this.value) {
      const arr = this.value.split('~')
      if (arr.length === 2) {
        this.start = moment(arr[0], this.format)
        this.end = moment(arr[1], this.format)
      }
    }
  },
  methods: {
    moment,
    change() {
      if (this.start && this.end) {
        console.log(this.start.format(this.format))
        this.$emit('input', this.start.format(this.format) + '~' + this.end.format(this.format))
      }
    }
  }
}
</script>

<style>
</style>
