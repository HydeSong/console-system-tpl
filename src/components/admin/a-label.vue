<template functional>
  <div class="a-label" :style="{color}">
    <span style="display:inline-block;font-weight:bord">
      <slot />
    </span>
  </div>
</template>
<script>
export default {
  functional: true,
  props: {
    value: {
      type: String,
      default: '标题'
    },
    color: {
      type: String,
      default: '#333333'
    }
  }
}
</script>

<style scoped>
.a-label {
  height: 16px;
  line-height: 16px;
  display: table;
  white-space: nowrap;
  margin: 10px 10px 10px 0px;
  letter-spacing: 0;
  text-align: left;
  padding-left: 5px;
  border-left: 2px solid #036eb8;
  width: 100vh;
}
.a-label::before {
  content: '';
  display: table-cell;
  position: relative;
  top: 50%;
  width: 3px;
}
.a-label::after {
  content: '';
  display: table-cell;
  position: relative;
  top: 50%;
  width: 99%;
}
</style>
