<template>
  <div class="folder-frame">
    <Sidebar />
    <transition name="el-fade-in">
      <router-view class="router-cnt" />
    </transition>
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
  },
  watch: {},
  methods: {
    checkLogin(){
      if(this.settings.uid===''||this.cookies===''){
        return false;
      }else{
        return true;
      }
    },
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
}
</style>