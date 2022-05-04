<template>
  <div class="folder-frame">
    <Sidebar />
    <!-- <div class="content"> -->
      <!-- <transition name="el-fade-in"> -->
        <router-view :class="{'router-cnt':true, 'fix-scrollbar':true, 'router-cnt-collapsed':isCollapse}" />
      <!-- </transition> -->
    <!-- </div> -->
  </div>
</template>

<script>
import Sidebar from "../folders/Sidebar.vue";
export default {
  name: "",
  components: { Sidebar },
  data() {
    return {};
  },
  computed: {
    settings: function () {
      return this.$store.getters.getSettings;
    },
    isCollapse(){
      return this.$store.state.isCollapse;
    }
  },
  watch: {},
  methods: {
    checkLogin(){
      return this.$store.getters.checkLogin;
    }
  },
  created() {},
  mounted() {
    if(this.checkLogin()){
    }else{
      console.log('未登录',this.settings);
      this.$router.push('/');
    }
  },
  beforeDestroy() {},
};
</script>

<style>
.folder-frame {
  display: flex;
}
.router-cnt {
  width: calc(100% - var(--side-width));
  height: 100%;
  box-sizing: border-box;
  overflow: scroll;
  transition: width .2s ease;
}
.router-cnt-collapsed{
  width: calc(100% - var(--side-collapse-width));
}
/* .folder-frame .content{
  display: flex;
  flex-direction: column;
  width: calc(100% - var(--side-width));
  height: 100%;
} */
</style>