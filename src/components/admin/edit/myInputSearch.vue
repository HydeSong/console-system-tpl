<template>
  <span>
    <a-input
      :title="display"
      :value="display"
      disabled
      :style="{width:'calc('+width+' - 42px)'}"
      @change="change"
    ></a-input>
    <a-button
      :disabled="readonly"
      class="my-input-sarch-button"
      style="display:inline;margin-left:-2px;border-radius:0px;"
      @click="$emit('search')"
      icon="ellipsis"
    ></a-button>
  </span>
</template>

<script>
export default {
  props: ['meta', 'value', 'showValue', 'readonly', 'width'],
  data() {
    return {
      mValue: null
    }
  },
  watch: {
    value() {
      this.mValue = this.value
    }
  },
  methods: {
    change() {
      this.$emit('input', this.mValue)
    }
  },
  computed: {
    display() {
      return this.showValue || this.value
    }
  },
  created() {
    this.mValue = this.value
  }
}
</script>

<style>
.has-error .my-input-sarch-button {
  border: 1px solid red;
}
</style>
