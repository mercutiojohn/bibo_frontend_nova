<template>
  <div class="login-dialog">
    <!-- Form -->
    <el-dialog title="Cookie登录" :visible.sync="visible" @close="closeLoginDialog" width="500px">
      <el-form :model="settings">
        <el-form-item label="UID" :label-width="formLabelWidth">
          <el-input v-model="settings.uid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Cookies" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 12}"
            v-model="settings.cookies"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeLoginDialog()">取消</el-button>
        <el-button type="primary" @click="commitChages()">登录</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "LoginDialog",
  components: {},
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      settings: {
        uid: "",
        cookies: "",
      },
      formLabelWidth: '120px'
    };
  },
  computed: {
    visible() {
      return this.$store.state.loginDialogVisible;
    },
    remoteSettings() {
      return this.$store.getters.getSettings;
    },
  },
  watch: {
    settings() {
      this.$store.commit("setSettings", this.settings);
    },
    visible() {
      this.settings = this.remoteSettings;
    },
  },
  methods: {
    updateSettings() {
      setTimeout(() => {
        this.$store.commit("setSettings", this.settings);
      }, 10);
    },
    closeLoginDialog() {
      this.$store.commit("setLoginDialogVisible", false);
    },
    commitChages() {
      this.updateSettings();
      this.closeLoginDialog();
    },
  },
  created() {},
  mounted() {
    this.settings = this.remoteSettings;
  },
  beforeDestroy() {},
};
</script>

<style>
</style>