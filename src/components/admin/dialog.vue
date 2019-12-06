<template>
  <a-modal
    :destroyOnClose="true"
    v-model="show"
    :style="{top:config.top?config.top:''}"
    :title="config.title"
    :width="config.width"
    name="modal"
    :afterClose="afterClose"
    class="admin-list-component"
    ref="dialog"
  >
    <component :is="component" :params="params" :meta="config"></component>
    <span slot="footer" v-if="config.showFooter">
      <a-button type="primary" @click="close">确定</a-button>
    </span>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      component: null,
      params: null,
      config: null
    }
  },
  methods: {
    close() {
      this.show = false
    }
  }
}
</script>

<style>
</style>
