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
        infinite-scroll-delay="30"
        infinite-scroll-immediate="false"
        key="1"
      >
        <el-card class="box-card" v-for="(item, index) in infos" :key="index">
          <div slot="header" class="card-header">
            <!-- <el-tooltip
              class="item"
              effect="dark"
              content="在播放器打开"
              placement="top-start"
            > -->
            <el-link
              class="title"
              @click="play(item.id, item.bvid, item.pages[0].cid, 1, item)"
            >
              {{ item.title }}
            </el-link>
            <!-- </el-tooltip> -->
            <div class="right">
              <a
                :href="'https://www.bilibili.com/video/' + item.bvid"
                target="_blank"
                ><el-button style="float: right; padding: 3px 0" type="text">
                  <i class="el-icon-link"></i>
                  网页打开
                </el-button>
              </a>
              <!-- <a
                :href="
                  'https://www.bilibili.com/blackboard/newplayer.html?high_quality=1&danmaku=0&playlist=true&playlist_order=sequential&musth5=1&noEndPanel=0&crossDomain=1&autoplay=1&aid=' +
                  item.id +
                  '&page=1'
                "
                target="_blank"
                ><el-button style="float: right; padding: 3px 0" type="text">
                  <i class="el-icon-link"></i>
                  纯享播放器
                </el-button>
              </a> -->
              <a :href="item.link" target="_blank"
                ><el-button style="float: right; padding: 3px 0" type="text">
                  <i class="el-icon-top-right"></i>
                  本地打开
                </el-button>
              </a>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="
                  share(
                    item.title,
                    'https://www.bilibili.com/video/' + item.bvid,
                    item.intro,
                    item.based_cover,
                    '@Mercutio'
                  )
                "
              >
                <i class="el-icon-top-right"></i>
                分享
              </el-button>
            </div>
          </div>
          <div class="item-details floated">
            <div class="left">
              <div class="cover">
                <img v-lazy="item.based_cover" alt="" srcset="" />
              </div>
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
                    <span class="data">{{
                      parseNumber(item.cnt_info.collect)
                    }}</span>
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
                    <span class="data">{{
                      parseNumber(item.cnt_info.danmaku)
                    }}</span>
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
                    <span class="data">{{
                      parseNumber(item.cnt_info.play)
                    }}</span>
                  </span>
                </el-tooltip>
              </div>
            </div>
            <div class="right">
              <div class="infos">
                <span
                  class="brief select-enable"
                  v-html="briefParseReturn(item.intro)"
                ></span>
                <!-- <span class="info">客户端链接:{{ item.link }}</span> -->
                <!-- <span class="title">{{ item }}</span> -->
                <!-- <span class="info">UP主头像URL:{{ item.upper.face }}</span> -->
                <!-- <span class="info">封面URL:{{ item.cover }}</span> -->
                <!-- <span class="info">BV号:{{ item.bvid }}</span> -->

                <!-- {{ item.pages }} -->
              </div>
              <div class="tags">
                <el-tag
                  class="tag"
                  v-for="(item_1, index_1) in item.tags"
                  :key="index_1"
                  :type="
                    item_1.tag_type == 'old_channel'
                      ? 'info'
                      : item_1.tag_type == 'topic'
                      ? 'warning'
                      : ''
                  "
                >
                  <i
                    class="el-icon-star-on"
                    v-if="item_1.tag_type == 'new_channel'"
                  ></i>
                  <i
                    class="el-icon-s-flag"
                    v-if="item_1.tag_type == 'topic'"
                  ></i>
                  <span class="tag-name">{{ item_1.tag_name }}</span>
                  <!-- <div class="extra-info">
                    <span class="info">标签名称：{{item_1.tag_name}}</span>
                    <span class="info">标签ID ： {{item_1.tag_name}}</span>
                    <span class="info">标签类型【（新/旧）频道channel/主题topic】：{{item_1.tag_type}}</span>
                  </div> -->
                </el-tag>
              </div>
              <el-collapse
                v-model="item.activeNames"
                @change="handleCollapseChange"
                class="pages-collapse-panel"
              >
                <el-collapse-item title="视频列表" name="1">
                  <div class="pages fix-scrollbar">
                    <div
                      class="page"
                      v-for="(item_1, index_1) in item.pages"
                      :key="index_1"
                      @click="
                        play(item.id, item.bvid, item_1.cid, item_1.page, item)
                      "
                    >
                      <div class="page-info page-num">{{ item_1.page }}</div>
                      <div class="page-info page-title">
                        {{ item_1.part }}
                      </div>
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
            </div>
          </div>
          <!-- <div class="bg">
            <div class="bg-box">
              <img class="blur-bg" v-lazy="item.based_cover" alt="" srcset="" />
            </div>
          </div> -->
          <div class="bottom floated">
            <a
              :href="'https://space.bilibili.com/' + item.upper.mid"
              target="_blank"
            >
              <div class="upper">
                <div class="avatar">
                  <img v-lazy="item.upper.based_face" alt="" srcset="" />
                </div>
                <div class="up-info">
                  <span class="info">{{ item.upper.name }}</span>
                  <span class="info uid inactive-text select-enable">{{
                    item.upper.mid
                  }}</span>
                </div>
              </div>
            </a>
            <div class="time-stats">
              <!-- <span class="info">收藏时间:{{ item.ctime }}</span> -->

              <span class="info inactive-text select-enable">{{
                item.bvid
              }}</span>
              <span class="info inactive-text">
                收藏时间:{{ getDate(item.ctime) }}
              </span>
              <!-- <span class="info">视频发布时间:{{ item.pubtime }}</span> -->
              <!-- <span class="info">视频发布时间:{{  getDate(item.pubtime) }}</span> -->
            </div>
          </div>
        </el-card>
        <el-card class="box-card" v-if="subLoading == true">
          <div slot="header" class="card-header-loading">
            <el-skeleton :rows="1" animated />
          </div>
          <div class="item-details-loading">
            <el-skeleton :rows="12" animated />
          </div>
        </el-card>
        <el-card class="box-card" v-if="subLoading == true">
          <div slot="header" class="card-header-loading">
            <el-skeleton :rows="1" animated />
          </div>
          <div class="item-details-loading">
            <el-skeleton :rows="12" animated />
          </div>
        </el-card>
      </div>
      <div v-else key="2">
        <div class="item-list skeleton">
          <el-card class="box-card">
          <div slot="header" class="card-header-loading">
            <el-skeleton :rows="1" animated />
          </div>
          <div class="item-details-loading">
            <el-skeleton :rows="12" animated />
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="card-header-loading">
            <el-skeleton :rows="1" animated />
          </div>
          <div class="item-details-loading">
            <el-skeleton :rows="12" animated />
          </div>
        </el-card>
        </div>
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
      pageSize: 6,
      pageNumber: 0,
      empty: false,
      loadingPics: false,
      subLoading: false,
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
      return this.$store.getters.checkLogin;
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
      this.subLoading = true;
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
        data: this.qs.stringify(data),
        url: "/favourites/ids_list",
      };
      this.$api(options).then((res) => {
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
        this.subLoading = false;
        return null;
      } else if (start > length) {
        this.subLoading = false;
        return null;
      }
      // console.log(end, ">", length, end > length);
      if (end > length) {
        // console.log("end changed from", end, "to", length);
        this.subLoading = false;
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
        data: this.qs.stringify(data),
        url: "/favourites/infos_list",
      };
      this.$api(options).then((res) => {
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
        this.subLoading = false;
        for (let i = start; i < end; i++) {
          this.getCover(this.infos[i].cover, "video", i);
          this.getCover(this.infos[i].upper.face, "face", i);
          this.getVideoPages(this.infos[i].id, i);
          this.getTags(this.infos[i].id, i);
        }
      });
    },
    getBasedPic(url, callback) {
      const data = {
        cover_url: url,
      };
      const options = {
        data: this.qs.stringify(data),
        url: "/cover",
      };
      this.$api(options).then(callback).catch(console.error);
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
          o_cover_url = o_cover_url + "@200w_200h_1c_100q.webp";
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
    parseNumber(num) {
      if (num > 10000) {
        return (num / 10000).toFixed(2) + "万";
      } else {
        return num;
      }
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
        data: this.qs.stringify(data),
        url: "/video/pages_list",
      };
      this.$api(options).then((res) => {
        // console.log(res.data);
        this.infos[index].pages = res.data.data;
        this.$nextTick(() => {
          this.$forceUpdate();
        });
      });
    },
    getTags(aid, index) {
      const data = {
        aid: aid,
        cookies: this.settings.cookies,
      };
      const options = {
        data: this.qs.stringify(data),
        url: "/video/tags_list",
      };
      this.$api(options).then((res) => {
        // console.log(res.data);
        this.infos[index].tags = res.data.data;
        this.$nextTick(() => {
          this.$forceUpdate();
        });
      });
    },
    handleCollapseChange() {},
    play(aid, bvid, cid, page, info) {
      const obj = {
        aid: aid,
        bvid: bvid,
        useBvid: false,
        usePage: true,
        page: page,
        cid: cid,
        info: info,
      };
      console.log(page, obj);
      this.$store.commit("play", obj);
      this.$bus.$emit("reloadVideo", "video");
    },
    share(title, link, desc, icon, from) {
      this.$share.setShareData({
        icon: icon,
        link: link,
        title: title,
        desc: desc,
        from: from,
      });
      try {
        this.$share.call();
        // 如果是分享到微信则需要 nativeShare.call('wechatFriend')
        // 类似的命令下面有介绍
      } catch (err) {
        // 如果不支持，你可以在这里做降级处理
        console.log(err);
      }
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
  padding: 20px;
  box-sizing: border-box;
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
.item-details > .left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.item-details > .right {
  display: flex;
  flex-direction: column;
  width: calc(100% - 150px);
  gap: 10px;
}
.item-details .right .infos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.item-details .right .title {
  font-size: 1.1em;
}
.item-details .right .infos .brief {
  font-size: 0.85em;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}
.upper {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
  border-radius: 5px;
}
.upper:hover {
  background: #eee;
}
.upper .up-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.upper .up-info .uid {
  font-size: 0.8em;
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
.card-header .title {
  font-size: 1.1em;
}
.card-header .right {
  user-select: text;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
.time-stats {
  /* text-align: right; */
  display: flex;
  gap: 10px;
  font-size: 0.8em;
  align-items: center;
}
.public-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  gap: 10px;
}
.public-stats .info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
}
.public-stats .info .icon {
  font-size: 1.2em;
  color: #ccc;
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  border-top: 1px solid #ebeef5;
  padding-top: 10px;
  flex-shrink: 0;
  padding: 20px;
  box-sizing: border-box;
  bottom: 0;
  background: #ffffff96;
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
  left: calc(var(--side-width) + 20px);
  width: calc(100vw - var(--side-width) - 40px);
}
.pages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow: scroll !important;
  background: #fafafa;
  padding: 15px 10px;
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
  gap: 10px;
  background: #fff;
  cursor: pointer;
}
.pages > .page:hover {
  border: 1px solid var(--accent-color);
}
.pages > .page:active {
  color: var(--accent-color);
  border: 1px solid var(--accent-color);
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
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.bg {
  width: 100%;
  height: 0;
  position: relative;
  bottom: 60px;
  pointer-events: none;
  z-index: 0;
  /* overflow: hidden; */
}
.blur-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* height: 100%; */
  filter: blur(100px);
  opacity: 0.3;
}
.bg-box {
  width: 100%;
  height: 226px;
  /* overflow: hidden; */
}
/* .floated {
  position: relative;
  z-index: 1;
} */
.card-header-loading {
  width: 100%;
}
.item-details-loading {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>
<style>
.folder .el-card {
  display: flex;
  flex-direction: column;
  /* box-shadow: 0 10px 20px 8px #fff!important; */
}
.folder .el-card__header {
  padding: 20px;
}
.folder .el-card__body {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.folder .el-collapse-item__header {
    box-sizing: border-box;
    padding: 0 10px;
}

.folder .el-collapse {
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #eee;
}

.folder .el-collapse-item__content {
    padding-bottom: 0;
}
</style>