<template>
  <div
    :style="!$route.meta.hiddenHeaderContent ? 'margin: -8px -8px 0px;' : 'margin: -30px -30px 0px;'"
  >
    <!-- pageHeader , route meta :true on hide -->
    <!-- <page-header
      v-if="!$route.meta.hiddenHeaderContent&&false"
      :title="pageTitle"
      :logo="logo"
      :avatar="avatar"
    >
      <slot slot="action" name="action" />
      <slot slot="content" name="headerContent" />
      <div v-if="!this.$slots.headerContent && description" slot="content">
        <p style="font-size: 14px;color: rgba(0,0,0,.65)">{{ description }}</p>
        <div class="link">
          <template v-for="(link, index) in linkList">
            <a :key="index" :href="link.href">
              <a-icon :type="link.icon" />
              <span>{{ link.title }}</span>
            </a>
          </template>
        </div>
      </div>
      <slot slot="extra" name="extra">
        <div class="extra-img">
          <img v-if="typeof extraImage !== 'undefined'" :src="extraImage" />
        </div>
      </slot>
      <div slot="pageMenu">
        <div v-if="search" class="page-menu-search">
          <a-input-search
            style="width: 80%; max-width: 522px;"
            placeholder="请输入..."
            size="large"
            enter-button="搜索"
          />
        </div>
        <div v-if="tabs && tabs.items" class="page-menu-tabs">
          <a-tabs :tab-bar-style="{margin: 0}" :active-key="tabs.active()" @change="tabs.callback">
            <a-tab-pane v-for="item in tabs.items" :key="item.key" :tab="item.title" />
          </a-tabs>
        </div>
      </div>
    </page-header>-->
    <div class="content">
      <!-- {{keepAlives}} -->
      <div class="page-header-index-wide">
        <!-- {{$route.meta}} -->
        <!-- keep-alive  -->

        <keep-alive :include="keepAlives">
          <router-view ref="content" v-if="multiTab||$route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!multiTab&&!$route.meta.keepAlive" ref="content" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import tabState from '@/components/MultiTab/tabState'
// import PageHeader from '@/components/PageHeader'
export default {
  name: 'PageView',
  components: {
    // PageHeader
  },
  props: {
    avatar: {
      type: String,
      default: null
    },
    title: {
      type: [String, Boolean],
      default: true
    },
    logo: {
      type: String,
      default: null
    },
    directTabs: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      tabState,
      pageTitle: null,
      description: null,
      linkList: [],
      extraImage: '',
      search: false,
      tabs: {},
      keepAlives: []
    }
  },
  computed: {
    ...mapState({
      multiTab: state => state.app.multiTab
    })
  },
  mounted() {
    this.tabs = this.directTabs
    this.getPageMeta()
    tabState.onKeepAliveChange(value => {
      this.keepAlives = value
    })
    tabState.bindRouterView(
      this.$refs.content.$vnode.tag.substring(this.$refs.content.$vnode.tag.lastIndexOf('-') + 1),
      this.$route.fullPath
    )
  },
  updated() {
    this.getPageMeta()
    tabState.bindRouterView(
      this.$refs.content.$vnode.tag.substring(this.$refs.content.$vnode.tag.lastIndexOf('-') + 1),
      this.$route.fullPath
    )
  },
  methods: {
    getPageMeta() {
      // eslint-disable-next-line
      this.pageTitle = typeof this.title === 'string' || !this.title ? this.title : this.$route.meta.title

      const content = this.$refs.content
      if (content) {
        if (content.pageMeta) {
          Object.assign(this, content.pageMeta)
        } else {
          this.description = content.description
          this.linkList = content.linkList
          this.extraImage = content.extraImage
          this.search = content.search === true
          this.tabs = content.tabs
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  margin: 0;
  .link {
    margin-top: 16px;
    &:not(:empty) {
      margin-bottom: 16px;
    }
    a {
      margin-right: 32px;
      height: 24px;
      line-height: 24px;
      display: inline-block;
      i {
        font-size: 24px;
        margin-right: 8px;
        vertical-align: middle;
      }
      span {
        height: 24px;
        line-height: 24px;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
.page-menu-search {
  text-align: center;
  margin-bottom: 16px;
}
.page-menu-tabs {
  margin-top: 48px;
}

.extra-img {
  margin-top: -60px;
  text-align: center;
  width: 195px;

  img {
    width: 100%;
  }
}

.mobile {
  .extra-img {
    margin-top: 0;
    text-align: center;
    width: 96px;

    img {
      width: 100%;
    }
  }
}
</style>
