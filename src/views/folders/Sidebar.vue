<template>
  <div
    :class="{
      sidebar: true,
      'fix-scrollbar': true,
      'sidebar-collapsed': isCollapse,
    }"
  >
    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group> -->
    <!-- <el-switch
      v-model="isCollapse"
      active-color="#13ce66"
      inactive-color="#eee"
      active-text="收起"
    >
    </el-switch> -->
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      router
      :collapse="isCollapse"
    >
      <el-menu-item index="/folders">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item-group v-if="!isCollapse" title="直播"> </el-menu-item-group>
      <el-menu-item index="/folders/streaming">
        <i class="el-icon-video-play"></i>
        <span slot="title">正在直播</span>
      </el-menu-item>
      <el-menu-item-group v-if="!isCollapse" title="收藏夹">
      </el-menu-item-group>
      <el-menu-item index="/folders/watch-later" disabled>
        <i class="el-icon-takeaway-box"></i>
        <span slot="title">稍后再看</span>
      </el-menu-item>
      <el-menu-item index="/folders/history">
        <i class="el-icon-time"></i>
        <span slot="title">历史记录</span>
      </el-menu-item>
      <el-submenu index="/folders/folder/">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span slot="title">创建的收藏夹</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            :index="`/folders/${item.id}`"
            v-for="(item, index) in folders"
            :key="index"
          >
            <i class="el-icon-folder"></i>
            <div class="folder-title-box">
              <span class="title">{{ item.title }}</span>
              <span class="count">{{ item.media_count }}</span>
            </div>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="/folders/subscribed" disabled>
        <i class="el-icon-menu"></i>
        <span slot="title">订阅的收藏夹</span>
      </el-menu-item>
      <!-- <el-menu-item index="5">
        <i class="el-icon-setting"></i>
        <span slot="title">我的关注</span>
      </el-menu-item> -->
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  components: {},
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
      folders: [
        {
          title: "加载中",
          id: "",
        },
      ],
    };
  },
  computed: {
    settings: function () {
      return this.$store.getters.getSettings;
    },
    isCollapse(){
      return this.$store.state.isCollapse;
    }
  },
  watch: {
    clientWidth(newWidth){
      watchWidth();
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getFolders() {
      const data = {
        uid: this.settings.uid,
        cookies: this.settings.cookies,
      };
      const options = {
        data: this.qs.stringify(data),
        url: "/favourites/folders",
      };
      this.$api(options).then((res) => {
        this.folders = res.data.data.list;
      });
    },
  },
  created() {},
  mounted() {
    this.getFolders();
  },
  beforeDestroy() {},
};
</script>

<style scoped>
.sidebar {
  width: var(--side-width);
  height: 100%;
  overflow: scroll;
  transition: width .2s ease;
}
.sidebar-collapsed {
  width: var(--side-collapse-width);
}
.el-menu-vertical-demo {
  height: 100%;
  /* width: 100%; */
}
.folder-title-box {
  display: flex;
  justify-content: space-between;
  width: 150px;
}
.folder-title-box .title {
  width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.folder-title-box .count {
  text-align: right;
  width: 40px;
}
.el-menu-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>