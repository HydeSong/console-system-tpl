<template>
  <div class="report-body">
    <!-- {{form}} -->
    <table width="99%">
      <tr v-for="(columns, index) in displayEditFields" :key="'e'+index">
        <template v-for="(col,index2) in columns">
          <td class="report-title" :key="'lb'+index+'form-'+index2">{{col.label}}</td>
          <td style="min-width:100px" :key="'val'+index+'form-'+index2">
            {{displayValue(col.prop,col.showProp)||'--'}}
            <!-- {{col}} -->
          </td>
          <td v-if="col.needFillEnd" :colspan="(2-index2)*2" :key="index2+'end'"></td>
        </template>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    reportFields: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 用于表单嵌套的场景
     */
    pvalue: {
      type: String,
      default: null
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      choiceMap: {}
    }
  },
  computed: {
    displayEditFields() {
      const rows = []
      let columns = []
      rows.push(columns)
      for (let index = 0; index < this.reportFields.length; index++) {
        const item = this.reportFields[index]
        if (columns.length < 3) {
          columns.push(item)
        } else {
          columns = []
          columns.push(item)
          rows.push(columns)
        }
      }
      if (columns.length < 3) {
        columns[columns.length - 1].needFillEnd = true
      }
      return rows
    }
  },
  created() {
    this.reportFields.forEach(item => {
      if (item.choice) {
        if (item.choice instanceof Function) {
          // this.choiceMap[item.prop] = []
          this.$set(this.choiceMap, item.prop, [])
          item.choice().then(data => {
            this.$set(this.choiceMap, item.prop, data)
            // this.choiceMap[item.prop] = data
          })
        } else {
          this.choiceMap[item.prop] = item.choice
        }
      }
    })
  },
  methods: {
    displayValue(prop, showProp) {
      if (this.choiceMap[prop]) {
        for (const option of this.choiceMap[prop]) {
          if (option.value + '' === this.form[prop] + '') {
            return option.label
          }
        }
      }
      if (showProp && this.form[showProp]) {
        return this.form[showProp]
      }
      return this.form[prop]
    }
  }
}
</script>

<style>
</style>
