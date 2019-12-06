<template>
  <div>
    <a-checkbox-group v-model="mValue" @change="change">
      <slot />
      <!-- <a-checkbox
        v-for="(item, index) in [{label:'test',value:234}]"
        :value="item.value"
        :key="'ck'+index"
      >{{item.label}}</a-checkbox>-->
    </a-checkbox-group>
  </div>
</template>

<script>
export default {
  props: ['value', 'form'],

  data() {
    return {
      mValue: []
    }
  },
  watch: {
    mValue() {
      this.$emit('input', this.mValue)
    },
    value() {
      this.mValue = this.value
    }
  },
  created() {
    if (!this.value) {
      this.$emit('input', this.mValue)
    } else {
      this.mValue = this.value
    }
    this.$emit('created', this.mValue)
  },
  methods: {
    change(val) {
      if (val) {
        val.getForm = () => {
          return this.form
        }
      }
      this.$emit('change', val)
    }
  }
}
</script>

<style>
</style>
