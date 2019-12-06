/*
 * @Author: zhangwencan
 * @Date: 2019-10-18 15:54:25
 * @Last Modified by: zhangwencan
 * @Last Modified time: 2019-10-21 09:39:25
 * 用来解决页面渲染的时候关联某些值关系问题
 */

export default {
  name: 'relBind',
  //   functional: true,
  props: ['source', 'path', 'value', 'debugger'],
  watch: {

  },
  created() {
    if (this.debugger) {
      debugger
    }
    this.$watch('source.' + this.path, (n, o) => {
      this.$emit('input', n)
    })
  },
  render(h, context) {
    return ''
  }

}
