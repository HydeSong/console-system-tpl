<template>
  <div ref="wrapper" :style="{height:height+'px','transition':'height 0.1s',overflow:'hidden'}">
    <div ref="inner">
      <slot />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
let vm = null
export default {
  props: ['pheight'],
  data() {
    return {
      height: 200,
      observer: null
    }
  },
  methods: {
    changeHeight: _.debounce(() => {
      console.log('changeHeight')
      //   debugger
      const height = vm.$refs.inner.clientHeight
      if (height > 200) {
        vm.height = height
      }
    }, 100)
  },
  beforeCreate() {
    vm = this
  },
  mounted() {
    const callback = function(mutationsList, observer) {
      vm.changeHeight()
    }
    const observer = new MutationObserver(callback)
    const config = { attributes: true, childList: true, subtree: true }
    observer.observe(this.$refs.inner, config)
    this.observer = observer
  },
  destroyed() {
    this.observer.disconnect()
  }
}
</script>

<style>
</style>
