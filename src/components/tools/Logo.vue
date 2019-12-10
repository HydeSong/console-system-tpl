<template>
  <div class="logo">
    <router-link :to="{name:'home'}">
      <!--      <LogoSvg alt="logo"/>-->
      <img :src="url" alt />
      <h1 style="font-size:16px;" v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.png'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  data() {
    return {
      url: LogoSvg
    }
  },
  props: {
    title: {
      type: String,
      default: '后台系统模版',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
