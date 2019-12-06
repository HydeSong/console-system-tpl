<template>
  <div>
    <slot />
  </div>
</template>

<script>
export default {
  methods: {
    validate() {
      let res = true
      this.$children
        .filter(item => {
          const tag = item.$vnode.componentOptions.tag
          return tag === 'edit-form-view'
        })
        .forEach(item => {
          if (!item.validate()) {
            res = false
          }
        })
      if (res) {
        return Promise.resolve()
      } else {
        return Promise.reject(new Error('表单填写有误'))
        // throw new Error('表单填写有误')
      }
    }
  }
}
</script>

<style>
</style>
