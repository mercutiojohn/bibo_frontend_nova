<template>
  <div class="sidebar fix-scrollbar">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
    >
      <router-link to="/folders/">
        <el-menu-item index="0">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
      </router-link>
      <el-menu-item-group title="直播">
        <router-link to="/folders/watch-later">
          <el-menu-item index="2" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">正在直播</span>
          </el-menu-item>
        </router-link>
      </el-menu-item-group>
      <el-menu-item-group title="收藏夹">
        <router-link to="/folders/watch-later">
          <el-menu-item index="1" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">稍后再看</span>
          </el-menu-item>
        </router-link>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>创建的收藏夹</span>
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
        <el-menu-item index="4" disabled>
          <i class="el-icon-setting"></i>
          <span slot="title">订阅的收藏夹</span>
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
          title: "加载中",
          id:''
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
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: this.qs.stringify(data),
        url: "http://127.0.0.1:5000/bilibili/favourites/folders",
      };
      this.$axios(options).then((res) => {
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
  width: 250px;
  height: 100%;
  overflow: scroll;
}
.el-menu-vertical-demo {
  height: 100%;
  width: 100%;
}
</style>