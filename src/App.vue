<template>
  <div id="app">
    <LoginDialog />
    <HeaderBar />
    <transition name="el-fade-in">
      <router-view class="main-cnt"></router-view>
    </transition>
    <PlayerBar v-if="checkLogin()" />
  </div>
</template>

<script>
import HeaderBar from "./components/HeaderBar.vue";
import LoginDialog from "./components/LoginDialog.vue";
import PlayerBar from "./components/player/PlayerBar.vue";
export default {
  components: { HeaderBar, LoginDialog, PlayerBar },
  data() {
    return {};
  },
  computed: {
    settings: function () {
      return this.$store.getters.getSettings;
    },
  },
  methods: {
    checkLogin() {
      return this.$store.getters.checkLogin;
    },
    getUserInfo() {
      const data = {
        cookies: this.settings.cookies,
      };
      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: this.qs.stringify(data),
        url: "http://127.0.0.1:5000/bilibili/user",
      };
      this.$axios(options).then((res) => {
        // console.log(res.data.data);
        this.$store.commit("setUserInfo", res.data.data);
      });
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
  },
  mounted() {
    if (this.checkLogin()) {
      this.getUserInfo();
    } else {
    }
  },
};
</script>
<style>
@import "styles/common.css";
body {
  margin: 0;
  user-select: none;
}
#app {
  /* font-family: Helvetica, sans-serif; */
  /* text-align: center; */
  background: #f5f5f5;
}
.main-cnt {
  width: 100%;
  height: calc(100vh - 61px - 60px);
}
a {
  text-decoration: none;
  color: black;
}
a:visited {
  color: black;
}
</style>
