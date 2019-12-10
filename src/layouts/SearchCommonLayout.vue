<!--
@file 商场、商户、订单查询页面布局
 -->
<template>
  <div>
    <a-row :gutter="24">
      <slot name="search-form" />
    </a-row>
    <a-row :gutter="24">
      <a-col span="8" class="search-common-layout-actions">
        <slot name="actions" />
      </a-col>
    </a-row>
    <a-row :gutter="24" style="margin-left: -24px;margin-right: -24px;margin-bottom: -24px;">
      <slot name="table" />
    </a-row>
  </div>
</template>
<script lang="ts">
import { Row, Col, Divider } from 'ant-design-vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Divider.name]: Divider
  }
})
class SearchCommonLayout extends Vue {}

export default SearchCommonLayout
</script>
<style>
.search-common-layout-actions {
  text-align: left;
}

.search-common-layout-actions button {
  margin-right: 15px;
}

.search-common-layout-fields-filter-btn {
  text-align: right;
  line-height: 32px;
}
</style>
