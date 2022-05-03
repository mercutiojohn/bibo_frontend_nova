<template>
  <div class="folder-main">
    <h1>你好，{{ userInfo.uname }}</h1>
    <div class="card-title">
      <h2>之前搁置的视频</h2>
      <router-link to="/folders/watch-later">
        <el-button>全部稍后再看 <i class="el-icon-arrow-right"></i></el-button>
      </router-link>
    </div>
    <!-- <to-view-brief /> -->
    <div class="card-title">
      <h2>正在直播的UP主</h2>
      <router-link to="/folders/streaming">
        <el-button>全部直播 <i class="el-icon-arrow-right"></i></el-button>
      </router-link>
    </div>
    <LiveBrief />
    <div class="card-title">
      <h2>从离开的视频继续</h2>
      <router-link to="/folders/history">
        <el-button>全部历史 <i class="el-icon-arrow-right"></i></el-button>
      </router-link>
    </div>
    <history-brief />
    <div class="card-title">
      <h2>特别关注动态</h2>
      <!-- <router-link to="/folders/">
        <el-button>默认收藏夹 <i class="el-icon-arrow-right"></i></el-button>
      </router-link> -->
    </div>
    <quick-look />
    <!-- <div class="card-title">
      <h2>最新收藏的内容</h2>
      <router-link to="/folders/">
        <el-button>默认收藏夹 <i class="el-icon-arrow-right"></i></el-button>
      </router-link>
    </div> -->
  </div>
</template>

<script>
import HistoryBrief from '../../components/cards/HistoryBrief.vue';
import LiveBrief from "../../components/cards/LiveBrief.vue";
import QuickLook from '../../components/cards/QuickLook.vue';
import ToViewBrief from '../../components/cards/ToViewBrief.vue';
export default {
  name: "Main",
  components: { LiveBrief, QuickLook, HistoryBrief,ToViewBrief },
  data() {
    return {}
  },
  computed: {
    settings: function () {
      return this.$store.getters.getSettings;
    },
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
  },
  watch: {},
  methods: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
};
</script>

<style scoped>
.folder-main {
  padding: 30px;
}
.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>