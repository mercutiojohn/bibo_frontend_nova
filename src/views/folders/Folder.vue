<template>
  <div class="folder">
    <!-- {{ fid }} -->
    <!-- {{ ids_raw }} -->
    <!-- {{infos}} -->
    <transition-group name="el-fade-in">
      <div
        class="item-list"
        v-if="!loading"
        v-infinite-scroll="loads"
        infinite-scroll-delay="100"
        infinite-scroll-immediate="false"
        key="1"
      >
        <el-card class="box-card" v-for="(item, index) in infos" :key="index">
          <div slot="header" class="card-header">
            <span class="title">{{ item.title }}</span>
            <div class="right">
              <span class="bvid inactive-text">{{ item.bvid }}</span>
              <a
                :href="'https://www.bilibili.com/video/' + item.bvid"
                target="_blank"
                ><el-button style="float: right; padding: 3px 0" type="text">
                  网页打开
                </el-button>
              </a>
              <a :href="item.link" target="_blank"
                ><el-button style="float: right; padding: 3px 0" type="text">
                  本地打开
                </el-button>
              </a>
            </div>
          </div>
          <div class="item-details">
            <div class="cover">
              <img :src="item.based_cover" alt="" srcset="" />
            </div>
            <div class="right">
              <div class="infos">
                <div class="public-stats">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="时长 / 视频数量"
                    placement="top-start"
                  >
                    <div class="basic-info">
                      <span class="info">{{ getTime(item.duration) }}</span>
                      <span class="info">共{{ item.page }}个视频</span>
                    </div>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="收藏"
                    placement="top-start"
                  >
                    <span class="info">
                      <i class="icon el-icon-star-off"></i>
                      <span class="data">{{ item.cnt_info.collect }}</span>
                    </span>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="弹幕"
                    placement="top-start"
                  >
                    <span class="info">
                      <i class="icon el-icon-tickets"></i>
                      <span class="data">{{ item.cnt_info.danmaku }}</span>
                    </span>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="播放量"
                    placement="top-start"
                  >
                    <span class="info">
                      <i class="icon el-icon-video-play"></i>
                      <span class="data">{{ item.cnt_info.play }}</span>
                    </span>
                  </el-tooltip>
                </div>

                <span
                  class="brief select-enable"
                  v-html="briefParseReturn(item.intro)"
                ></span>
                <!-- <span class="info">客户端链接:{{ item.link }}</span> -->
                <!-- <span class="title">{{ item }}</span> -->
                <!-- <span class="info">UP主头像URL:{{ item.upper.face }}</span> -->
                <!-- <span class="info">封面URL:{{ item.cover }}</span> -->
                <!-- <span class="info">BV号:{{ item.bvid }}</span> -->
                  <el-collapse v-model="item.activeNames" @change="handleChange" class="pages-collapse-panel">
                    <el-collapse-item title="视频列表" name="1">
                      <div class="pages fix-scrollbar">
                        <div
                          class="page"
                          v-for="(item_1, index_1) in item.pages"
                          :key="index_1"
                        >
                          <div class="page-info page-num">{{ item_1.page }}</div>
                          <div class="page-info page-title">{{ item_1.part }}</div>
                          <div class="page-info page-duration">
                            {{ getTime(item_1.duration) }}
                          </div>
                          <!-- <div class="extra-info">
                        <div class="info">CID:{{item_1.cid}}</div>
                        <div class="info">来源:{{item_1.from}}</div>
                        <div class="info">视频id （无内容）:{{item_1.vid}}</div>
                        <div class="info">链接（无内容）:{{item_1.weblink}}</div>
                        <div class="info">长宽比:{{item_1.dimension.height}}x{{item_1.dimension.width}} 旋转{{item_1.dimension.rotate}}</div>
                                            </div> -->
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                  <!-- {{ item.pages }} -->

              </div>
            </div>
          </div>
          <div class="bottom">
            <a
              :href="'https://space.bilibili.com/' + item.upper.mid"
              target="_blank"
            >
              <div class="upper">
                <div class="avatar">
                  <img :src="item.upper.based_face" alt="" srcset="" />
                </div>
                <div class="right">
                  <span class="info">{{ item.upper.name }}</span>
                  <span class="info inactive-text select-enable">{{
                    item.upper.mid
                  }}</span>
                </div>
              </div>
            </a>
            <div class="time-stats">
              <!-- <span class="info">收藏时间:{{ item.ctime }}</span> -->
              <span class="info inactive-text"
                >收藏时间:{{ getDate(item.ctime) }}</span
              >
              <!-- <span class="info">视频发布时间:{{ item.pubtime }}</span> -->
              <!-- <span class="info">视频发布时间:{{  getDate(item.pubtime) }}</span> -->
            </div>
          </div>
        </el-card>
      </div>
      <div v-else key="2">
        <el-skeleton class="skeleton" :rows="12" animated />
      </div>
    </transition-group>
  </div>
</template>

<script>
import Vue from "vue";
import { Table } from "element-ui";
import Sidebar from "./Sidebar.vue";
Vue.use(Table);
export default {
  name: "Folder",
  components: { Sidebar },
  data() {
    return {
      ids_raw: [],
      infos: [],
      loading: true,
      pageSize: 30,
      pageNumber: 0,
      empty: false,
      loadingPics: false,
    };
  },
  computed: {
    fid() {
      return this.$route.params.id;
    },
    settings: function () {
      return this.$store.getters.getSettings;
    },
  },
  watch: {
    fid(newId) {
      this.refresh();
    },
  },
  methods: {
    checkLogin() {
      if (this.settings.uid === "" || this.cookies === "") {
        return false;
      } else {
        return true;
      }
    },
    refresh() {
      while (this.loading) {}
      this.pageNumber = 0;
      this.infos = [];
      this.$forceUpdate();
      this.$nextTick(() => {
        this.getIds();
      });
    },

    loads() {
      this.pageNumber++;
      this.parseIds();
    },
    getIds() {
      this.loading = true;
      const data = {
        fid: this.fid,
        cookies: this.settings.cookies,
      };
      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: this.qs.stringify(data),
        url: "http://127.0.0.1:5000/bilibili/favourites/ids_list",
      };
      this.$axios(options).then((res) => {
        // console.log(res.data);
        this.ids_raw = res.data.data;
        this.parseIds();
      });
    },
    parseIds() {
      let page = this.pageNumber;
      let ids = "";
      const length = this.ids_raw.length;
      const pageSize = this.pageSize;
      let start = page * pageSize;
      let end = page * pageSize + pageSize;
      if (start == length) {
        this.empty = true;
        return null;
      } else if (start > length) {
        return null;
      }
      // console.log(end, ">", length, end > length);
      if (end > length) {
        // console.log("end changed from", end, "to", length);
        end = length;
      }
      console.log("length", length, "start", start, "end", end);
      for (let i = start; i < end; i++) {
        if (i != 0) {
          ids += ",";
        }
        // console.log(this.ids_raw[i].id);
        ids += this.ids_raw[i].id + ":2";
      }
      // console.log(ids);
      //   console.log(this.ids);
      this.getInfos(ids, start, end);
    },
    async getInfos(ids, start, end) {
      const data = {
        ids: ids,
        cookies: this.settings.cookies,
      };
      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: this.qs.stringify(data),
        url: "http://127.0.0.1:5000/bilibili/favourites/infos_list",
      };
      this.$axios(options).then((res) => {
        // console.log(res.data);
        for (let item of res.data.data) {
          this.infos.push(item);
        }
        for (let i = start; i < end; i++) {
          this.infos[
            i
          ].based_cover = require("../../assets/images/video/bili-fail.png");
          this.infos[
            i
          ].upper.based_face = require("../../assets/images/video/bili-fail.png");
          this.infos[i].parsed_cover = false;
          this.infos[i].upper.parsed_face = false;
          this.infos[i].activeNames = [];
          this.infos[i].pages = [
            {
              cid: 0,
              dimension: {
                height: 1080,
                rotate: 0,
                width: 1920,
              },
              duration: 10,
              from: "vupload",
              page: 1,
              part: "加载中",
              vid: "",
              weblink: "",
            },
          ];
        }
        this.loading = false;
        for (let i = start; i < end; i++) {
          this.getCover(this.infos[i].cover, "video", i);
          this.getCover(this.infos[i].upper.face, "face", i);
          this.getVideoPages(this.infos[i].id, i);
        }
      });
    },
    getBasedPic(url, callback) {
      const data = {
        cover_url: url,
      };
      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: this.qs.stringify(data),
        url: "http://127.0.0.1:5000/bilibili/cover",
      };
      this.$axios(options).then(callback).catch(console.error);
    },
    getCover(url, type, index) {
      if (this.loading) return;
      let o_cover_url = url;
      if (type == "video") {
        if (this.infos[index].parsed_cover == true) {
          return this.infos[index].based_cover;
        } else {
          o_cover_url = o_cover_url + "@351w_219h_1c_100q.webp";
          this.getBasedPic(o_cover_url, (res) => {
            this.infos[index].based_cover = "data:image/png;base64," + res.data;
            this.infos[index].parsed_cover = true;
            this.$nextTick(() => {
              this.$forceUpdate();
              // console.log("based cover", index);
            });
          });
          return this.infos[index].based_cover;
        }
      } else if (type == "face") {
        if (this.infos[index].upper.parsed_face == true) {
          return this.infos[index].upper.based_face;
        } else {
          o_cover_url = o_cover_url + "@600w_600h_1c_100q.webp";
          this.getBasedPic(o_cover_url, (res) => {
            this.infos[index].upper.based_face =
              "data:image/png;base64," + res.data;
            this.infos[index].upper.parsed_face = true;
            this.$nextTick(() => {
              this.$forceUpdate();
              // console.log("based face", index);
            });
          });
          return this.infos[index].upper.based_face;
        }
      }
    },
    checkIfLoaded(item, type) {
      if (type == "video") {
        return item.based_cover;
      } else if (type == "face") {
        return item.upper.based_face;
      }
    },
    getDate(datestring) {
      return new Date(datestring * 1000).toLocaleString();
    },
    briefParseReturn(text) {
      return text.replace(/[\n]/g, "<br/>");
    },
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    getTime(timestring) {
      let h = new Date(timestring * 1000).getUTCHours();
      let m = new Date(timestring * 1000).getMinutes();
      let s = new Date(timestring * 1000).getSeconds();
      m = this.checkTime(m);
      s = this.checkTime(s);
      return (h != 0 ? h + ":" : "") + m + ":" + s;
    },
    getVideoPages(aid, index) {
      const data = {
        aid: aid,
        cookies: this.settings.cookies,
      };
      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: this.qs.stringify(data),
        url: "http://127.0.0.1:5000/bilibili/video/pages_list",
      };
      this.$axios(options).then((res) => {
        // console.log(res.data);
        this.infos[index].pages = res.data.data;
        this.$nextTick(() => {
          this.$forceUpdate();
          // console.log("based face", index);
        });
      });
    },
  },
  created() {},
  mounted() {
    console.log(this.settings);
    if (this.checkLogin()) {
      this.getIds();
    } else {
      this.empty = true;
      console.log("未登录", this.settings);
      this.$router.push("/");
    }
  },
  beforeDestroy() {},
};
</script>
<style scoped>
.folder {
  padding: 20px;
}
.item-list {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
}
.item-details {
  display: flex;
  /* flex-direction: column; */
  gap: 20px;
  /* height: 100%; */
}
.item-details .cover {
  --width: 150px;
  width: var(--width);
  height: calc(var(--width) / 16 * 9);
  overflow: hidden;
  border-radius: 8px;
}
.item-details .cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.item-details > .right {
  display: flex;
  flex-direction: column;
  width: calc(100% - 150px);
}
.item-details .right .infos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.item-details .right .title {
  font-size: 1.1em;
}
.item-details .right .infos .info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 0.9em;
}
.item-details .right .infos .info .icon {
  font-size: 1.2em;
}
.item-details .right .infos .brief {
  font-size: 0.8em;
}
.upper {
  display: flex;
  align-items: center;
  gap: 10px;
}
.upper .right {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.upper .avatar {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  overflow: hidden;
}
.upper .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.card-header .right {
  user-select: text;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
.time-stats {
  text-align: right;
  display: flex;
  gap: 10px;
}
.public-stats {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 10px;
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  border-top: 1px solid #ebeef5;
  padding-top: 10px;
  flex-shrink: 0;
}
/* .box-card{
  display:flex;
  flex-direction: column;
}
.el-card__body{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
} */
.skeleton {
  position: fixed;
  top: calc(61px + 20px);
  left: calc(200px + 20px);
  width: calc(100vw - 200px - 40px);
}
.pages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow: scroll!important;
}
.pages > .page {
  flex-shrink: 0;
  /* width: calc(100% - 60px); */
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #eee;
  padding: 10px 15px;
  border-radius: 10px;
  gap:10px;
}
.pages > .page > .page-info {
  font-size: 0.8em;
}
.pages > .page > .page-num {
  width: 30px;
}
.pages > .page > .page-title {
  text-align: left;
  font-size: 0.8em;
  width: calc(100% - 50px - 30px);
}
.pages > .page > .page-duration {
  text-align: right;
  font-size: 0.8em;
  width: 50px;
}
</style>