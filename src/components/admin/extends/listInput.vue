<template>
  <div class="report-body" :style="{display:'table',padding:meta.padding}">
    <!-- {{value}} -->
    <table width="650">
      <tr style="text-align:center">
        <td v-for="(item, index) in meta.fields" :key="index" class="list-title">{{item.label}}</td>
        <td v-if="!readonly" class="list-title">
          <a @click="createRow">添加</a>
        </td>
      </tr>
      <tr v-for="(row, index) in  value" :key="index">
        <td v-for="(field, index) in meta.fields" :key="index">
          <a-input :disabled="readonly" v-model="row[field.prop]" size="small"></a-input>
        </td>
        <td v-if="!readonly" align="center">
          <a-button type="dashed" size="small" @click="()=>{value.splice(index,1)}">删除</a-button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: ['value', 'readonly', 'meta'],
  methods: {
    getDefault() {
      if (this.meta.default) {
        return this.meta.default
      } else {
        const data = {}
        for (const item of this.meta.fields) {
          data[item.prop] = null
        }
        return data
      }
    },
    validate() {
      if (this.meta.validator) {
        return this.meta.validator(this.value)
      }
      return true
    },
    createRow() {
      this.value.push(this.getDefault())
    }
  },
  created() {
    if (!this.value) {
      this.$emit('input', [])
    }
  }
}
</script>

<style>
</style>
