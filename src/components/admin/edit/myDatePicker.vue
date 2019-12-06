<template>
  <span>
    <a-date-picker
      style="width:122px;"
      v-model="mValue"
      placeholder
      @change="onChange"
      :format="format"
    ></a-date-picker>
    <a-button
      style="display:inline;margin-left:-2px;border-radius:0px;"
      @click="mValue = moment('9999-12-31',format);$emit('input', '9999-12-31');$emit('change')"
    >长期</a-button>
  </span>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    }
  },
  data() {
    return {
      mValue: null
    }
  },
  watch: {
    value() {
      if (this.value) {
        this.mValue = moment(this.value, this.format)
      } else {
        this.mValue = null
      }
    }
  },
  created() {
    if (this.value) {
      this.mValue = moment(this.value, this.format)
    }
  },
  methods: {
    moment,
    onChange(date, dateString) {
      console.log(date, dateString)
      if (this.value !== dateString) {
        this.$emit('input', dateString)
      }
      this.$emit('change')
    }
  }
}
</script>

<style>
</style>
