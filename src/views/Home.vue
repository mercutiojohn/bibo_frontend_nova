<template>
  <div class="home">
    <div class="login-box">
      <h1>登录</h1>
      <div>
        <el-button @click="openLoginDialog()">Cookie登录</el-button>
        <!-- <el-button @click="startHacking">二维码登录</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
    };
  },
  computed: {
    settings: function () {
      return this.$store.getters.getSettings;
    },
    loginDialogVisible(){
      return this.$store.state.loginDialogVisible;
    }
  },
  watch: {
    settings() {
      this.$store.commit("setSettings", this.settings);
      this.ifLogined();
    },
    loginDialogVisible(status){
      if(status == false)this.ifLogined();
    }
  },
  methods: {
    ifLogined(){
      if(this.checkLogin()){
        this.getUserInfo();
        this.redirectIfLogined();
      }
    },
    getUserInfo() {
      const data = {
        cookies: this.settings.cookies,
      };
      const options = {
        data: this.qs.stringify(data),
        url: "/user",
      };
      this.$api(options).then((res) => {
        // console.log(res.data.data);
        this.$store.commit("setUserInfo", res.data.data);
      });
    },
    checkLogin(){
      return this.$store.getters.checkLogin;
    },
    startHacking() {
      this.$notify({
        title: "It works!",
        type: "success",
        message:
          "We've laid the ground work for you. It's time for you to build something epic!",
        duration: 5000,
      });
    },
    forceUpdateSettings() {
      setTimeout(() => {
        this.$store.commit("setSettings", this.settings);
      }, 10);
    },
    redirectIfLogined(){
        this.$router.push('/folders')
    },
    openLoginDialog() {
      this.$store.commit("setLoginDialogVisible", true);
    },
  },
  created() {},
  mounted() {
    this.ifLogined();
  },
  beforeDestroy() {},
};
</script>

<style scoped>
.home {
  overflow: scroll;
  height: calc(100vh - var(--head-height));
}
.login-box {
  padding: 20px;
  max-width: 700px;
  box-sizing: border-box;
  margin: 20px auto;
  border-radius: 10px;
  background: #fff;
}
</style>