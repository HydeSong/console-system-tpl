export default {
  name: 'renderView',
  functional: true,
  props: {
    meta: {
      type: Object,
      default: () => {
        return {
          title: '',
          render: null
        }
      }
    }
  },
  render(h, context) {
    const { render } = context.props.meta
    if (render) {
      return [render(h, context)]
    }
    return []
  }
}
