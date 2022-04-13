<template>
  <div :class="{ 'player-bar': true, 'player-bar-maximized': expandMode }">
    <transition name="el-zoom-in-bottom">
      <div class="expanded-mode" v-show="expandMode">
        <div class="main-content">main</div>
      </div>
    </transition>
    <div class="minimized-mode">
      <div class="left">
        <div class="preview">123</div>
        <div class="controls">345</div>
      </div>
      <div class="center">
        <div class="progress">456</div>
      </div>
      <div class="right">
        <div class="funcs"></div>
        <div class="playlist"></div>
        <el-button @click="changeExpand()">
          <i :class="{'el-icon-arrow-up':!expandMode,'el-icon-arrow-down':expandMode}"></i>
          </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayerBar",
  components: {},
  data() {
    return {
      expandMode: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    changeExpand() {
      this.expandMode ? (this.expandMode = false) : (this.expandMode = true);
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
};
</script>

<style scoped>
.player-bar {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  /* height: 60px; */
  transition: background 0.2s ease;
}
.player-bar-maximized {
  background: #00000020;
}
.minimized-mode {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
}
.expanded-mode {
  width: 100%;
  height: calc(100vh - 60px);
  background: #fff;
  display: flex;
  flex-direction: column;
}
.expanded-mode .main-content {
  width: 100%;
  /* background: #fff; */
}
</style>