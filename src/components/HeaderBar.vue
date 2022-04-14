<template>
  <div class="header">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <li role="menuitem" class="el-submenu site-logo">
        <span>必播</span>
      </li>
      
      <el-submenu index="1">
          <template slot="title">{{checkLogin()?userInfo.uname:'登录'}}</template>
        <router-link to="/">
        <el-menu-item index="2-1" v-if="!checkLogin()">登录</el-menu-item>
        </router-link>
        <el-menu-item index="2-2" @click="logout()" v-if="checkLogin()">退出登录</el-menu-item>
      </el-submenu>
      <el-menu-item index="2"><router-link to="/folders">收藏</router-link></el-menu-item>
      <el-menu-item index="3"><router-link to="/feeds" disabled>动态</router-link></el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "HeaderBar",
  components: {},
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
    };
  },
  computed: {
    settings: function () {
      return this.$store.getters.getSettings;
    },
    userInfo(){
      return this.$store.getters.getUserInfo;
    }
  },
  watch: {},
  methods: {
    checkLogin(){
      return this.$store.getters.checkLogin;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    logout(){
      this.$store.commit("logout");
      this.$router.push('/');
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
};
</script>


<style>
.site-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 60px;
}
</style>