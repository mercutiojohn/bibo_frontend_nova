<template>
  <div class="sidebar fix-scrollbar">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
    >
      <router-link to="/feeds/">
        <el-menu-item index="0">
          <i class="el-icon-menu"></i>
          <span slot="title">动态</span>
        </el-menu-item>
      </router-link>
      <el-menu-item-group title="关注">
      <router-link to="/folders/watch-later">
        <el-menu-item index="2" disabled>
          <i class="el-icon-document"></i>
          <span slot="title">全部关注</span>
        </el-menu-item>
      </router-link>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>关注分组</span>
        </template>
        <!-- <el-menu-item-group> -->
          <router-link
            :to="`/folders/${item.id}`"
            v-for="(item, index) in folders"
            :key="index"
          >
            <el-menu-item :index="`1-${index + 1}`">
              {{ item.title }}
              {{ item.media_count }}
            </el-menu-item>
          </router-link>
        <!-- </el-menu-item-group> -->
      </el-submenu>
      <el-menu-item index="5" disabled>
        <i class="el-icon-setting"></i>
        <span slot="title">悄悄关注</span>
      </el-menu-item>
      </el-menu-item-group>
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
      activeIndex: "0",
      activeIndex2: "1",
      folders: [
        {
          title: "测试",
        },
        {
          title: "测试2",
        },
      ],
    };
  },
  computed: {
    settings: function () {
      return this.$store.getters.getSettings;
    },
  },
  watch: {},
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

<style>
.sidebar {
  width: var(--side-width);
  height: 100%;
  overflow: scroll;
}
.el-menu-vertical-demo {
  height: 100%;
  width: 100%;
}
</style>