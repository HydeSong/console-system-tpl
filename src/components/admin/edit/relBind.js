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
