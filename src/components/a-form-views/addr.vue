<template>
  <span>
    <a-cascader
      placeholder="请选择省市县"
      :value="selectData"
      :options="citys"
      @change="handleChange"
      style="width:250px"
    />
    <a-input
      v-model="mValue"
      placeholder="详细地址"
      style="width:256px;display:inline;margin-left:10px;"
      @change="$emit('change', value)"
    ></a-input>
  </span>
</template>

<script>
import citys from './citys'
export default {
  props: ['value', 'meta'],
  data() {
    return {
      citys,
      selectData: [],
      mValue: ''
    }
  },
  watch: {
    mValue(n) {
      this.value[this.meta.addr] = n
    }
  },
  created() {
    this.$watch('value.' + this.meta.province, () => {
      this.selectData = [this.value[this.meta.province], this.value[this.meta.city], this.value[this.meta.county]]
    })
    this.selectData = [this.value[this.meta.province], this.value[this.meta.city], this.value[this.meta.county]]
    this.mValue = this.value[this.meta.addr]
  },
  methods: {
    handleChange(value) {
      this.value[this.meta.province] = value[0]
      this.value[this.meta.city] = value[1]
      this.value[this.meta.county] = value[2]
      this.value[this.meta.addr] = this.mValue
      this.selectData = [this.value[this.meta.province], this.value[this.meta.city], this.value[this.meta.county]]
      // debugger
      // this.$emit('validate', this.value)

      this.$emit('change', this.value)
    },
    validate() {
      if (this.meta.required) {
        if (
          this.value[this.meta.province] &&
          this.value[this.meta.city] &&
          this.value[this.meta.county] &&
          this.value[this.meta.addr]
        ) {
          return true
        }
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style>
</style>
