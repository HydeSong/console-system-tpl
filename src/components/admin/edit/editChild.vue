<template>
  <div>
    {{covertArrayData(form,item)}}
    <span
      v-for="(child, index3) in children"
      :key="'ch'+index3"
      :style="{display:child.inPanel&&!child.pass?'block':'',border:child.inPanel&&!child.pass?'1px solid #e9e9e9':'',padding:child.inPanel&&!child.pass?'10px':'',marginBottom:child.inPanel&&!child.pass?'10px':''}"
    >
      <a-divider v-if="child.inPanel&&!child.pass" orientation="left">{{child.label}}</a-divider>
      {{!form[child.group]?($set(form,child.group,{isArray:true} )):'' }}
      {{initItemData(child)}}
      {{!form[child.group]['array-'+child.value]?($set(form[child.group],'array-'+child.value,{label:child.label,value:child.value,prop:item.prop} )):'' }}
      <!-- 设置默认属性，当数据被重置的时候，可重新设置 -->
      {{($set(form[child.group]['array-'+child.value],'valid',!child.pass))?'':''}}
      {{($set(form[child.group]['array-'+child.value],'RowStatus',!child.pass?'VALID':'INVALID'))?'':''}}
      <edit
        :key="child._key"
        :editFields="child.editFields"
        v-if="!child.pass"
        :pvalue="child.value"
        :form="form[child.group]['array-'+child.value]"
      ></edit>
    </span>
  </div>
</template>

<script>
export default {
  props: ['form', 'item'],
  name: 'edit-child',
  componentName: 'edit-child',
  computed: {
    children() {
      if (this.item.children) {
        return this.item.children
      } else if (this.item.childrenProp) {
        return this.item[this.item.childrenProp]
      }
      return []
    }
  },
  methods: {
    random() {
      const propName = Math.random()
        .toString(36)
        .slice(-8)
      return propName
    },
    initItemData(item) {
      if (!item._key) {
        item._key = this.random()
      }
      if (item.init) {
        item.init(this.form[item.prop])
      }
      // if (this.form[item.prop] === undefined) {
      //   debugger
      //   this.$set(this.form, item.prop, {})
      // }
    },
    /**
     * 因为传入的格式和真正渲染的格式在数组的情况下有差异，所以这里做一个转换
     * 自定义表单组件的几个要点：1、value同步，2、created事件触发，在数据载入的时候能正确生成子视图
     */
    covertArrayData(form, item) {
      // debugger
      if (item.children instanceof Array) {
        // 通过子节点反射父节点的数组内容
        for (const child of item.children) {
          const { group } = child
          if (form[group] instanceof Array) {
            const array = form[group]
            delete form[group]
            const newObjArray = { isArray: true }
            for (const childFormData of array) {
              // const valueProp = item.prop
              const value = childFormData[item.prop]
              // 还原父节点内容
              // if (isParentNeedInit) {
              //   form[item.prop].push(value)
              // }
              newObjArray['array-' + value] = Object.assign({ value, prop: item.prop, valid: true }, childFormData)
              // form[group] = newObjArray
              this.$set(form, group, newObjArray)
            }
          }
          // {isArray:true}
        }
      }
    }
  }
}
</script>

<style>
</style>
