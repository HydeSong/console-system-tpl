<template>
  <div>
    <a-form layout="inline" style="padding:10px 10px">
      <a-form-item label>
        <a-input style="width:250px" size="default" placeholder="请输入MCC码" v-model="mccSearchText"></a-input>
      </a-form-item>
      <div v-if="meta.multi" style="padding:0px 0px;">
        <a-tag
          style="margin-right:5px;margin-bottom:5px;margin-top:7px;"
          color="red"
          :key="tag.mccCode"
          type="danger"
          v-for="(tag,index) in selected"
          closable
          :disable-transitions="false"
          @close="removeTaget(index)"
        >{{tag.mccName}}</a-tag>
        <a
          icon="el-icon-delete"
          style="width:100px;"
          v-if="selected.length>0"
          @click="selected=[]"
        >清空已选项</a>
      </div>
    </a-form>

    <xw-table :config="config" />
  </div>
</template>

<script>
import xwTable from '@/components/xwTable'
import mccList from '@/lib/mcc'
export default {
  components: { xwTable },
  props: {
    // multi: {
    //   type: Boolean,
    //   default: false
    // },
    meta: {
      type: Object
    }
  },
  data() {
    const vm = this
    return {
      mccSearchText: null,
      selected: [],
      optButton: [
        {
          label: '选择'
        }
      ],
      config: {
        //         label: 'Name',
        // prop: 'deviceProviderName',
        // width: '20%'
        columns: [
          { label: 'mcc码', prop: 'mccCode' },
          { label: 'mcc名称', prop: 'mccName' },
          { label: '描述', prop: 'memo' },
          {
            label: '操作',
            prop: 'mccId',
            render(h, text, record, index) {
              return (
                <a-button size="small" onClick={() => vm.mccChange(record)} type="primary">
                  选择
                </a-button>
              )
            }
          }
        ],
        data: mccList
      }
    }
  },
  watch: {
    mccSearchText(nVal, oVal) {
      this.config.data = mccList.filter(item => item.mccCode.startsWith(nVal))
    }
  },
  //   computed: {
  //     mccData(nVal, oVal) {
  //       return mccList.filter(item => item.mccCode.startsWith(nVal))
  //     }
  //   },
  methods: {
    mccChange(record) {
      if (!this.selected.includes(record)) {
        this.selected.push(record)
      }
    },
    removeTaget(index) {
      this.selected.splice(index, 1)
    },
    getComponentValue() {
      return this.selected
    }
  }
}
</script>

<style>
</style>
