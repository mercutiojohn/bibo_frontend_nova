<template>
  <div :class="{ 'player-bar': true, 'player-bar-maximized': expandMode }">
    <transition name="el-zoom-in-bottom">
      <div
        :class="{'expanded-mode':true,'expanded-mode-collapsed':isCollapse}"
        v-if="expandMode && (player.playing || playerLive.playing)"
      >
        <div :class="{'video-box-template':true,'video-box-template-collapsed':isCollapse}"></div>
        <div :class="{'main-content':true,'fix-scrollbar':true,'main-content-collapsed':isCollapse}">
          <div class="video-info" v-if="type == 'video'">
            <div class="title-box">
              <div class="title">{{ player.info.title }}</div>
              <div
                class="info select-enable"
                v-html="briefParseReturn(player.info.intro)"
              ></div>
            </div>
            <div class="info-header-bar"><span>视频列表</span></div>
            <div class="pages">
              <div
                :class="{'page':true,'page-playing':player.page==item.page}"
                v-for="(item, index) in player.info.pages"
                :key="index"
                @click="play(item.cid, item.page)"
              >
                <div class="page-info page-num">{{ item.page }}</div>
                <div class="page-info page-title">
                  {{ item.part }}
                </div>
                <div class="page-info page-duration">
                  {{ getTime(item.duration) }}
                </div>
              </div>
            </div>
            <div class="info-bottom-bar">
              <el-button @click="popupPlayer">弹出窗口看高清</el-button>
              <el-checkbox v-model="autoSwitchPopup">
                自动切换弹出窗口视频
              </el-checkbox>
            </div>
          </div>
          <div class="live-info" v-if="type == 'live'">
            <div class="title-box">
              <div class="title">{{ playerLive.info.title }}</div>
              <div class="info">{{ playerLive.info.uname }}</div>
              <div class="info">{{ playerLive.info.uid }}</div>
              <!-- <div class="info select-enable" v-html="briefParseReturn(player.info.intro)"></div> -->
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div
      :class="{
        'minimized-mode': true,
        'bottom-bar-minimized':
          !expandMode && (player.playing || playerLive.playing),
      }"
    >
      <div class="left">
        <div class="playing-info" v-if="player.playing">
          <div class="sub-title">
            <span class="page-number">{{ player.page }}</span>
            {{ player.info.pages[Number(player.page) - 1].part }}
          </div>
          <div class="title">
            {{ player.info.title }}
            <span class="upper-name inactive-text">
              - {{ player.info.upper.name }}
            </span>
          </div>
        </div>
        <div class="playing-info" v-if="playerLive.playing">
          <div class="sub-title">
            {{ playerLive.info.title }}
          </div>
          <div class="title">
            {{ playerLive.info.uname }}
          </div>
        </div>
        <div
          class="playing-info-not-playing"
          v-if="!player.playing && !playerLive.playing"
        >
          <div class="title inactive-text">未在播放</div>
        </div>
      </div>
      <div class="center">
        <!-- <div class="progress">456</div> -->
      </div>
      <div class="right">
        <div class="playlist"></div>
        <el-button
          @click="stopPlayer()"
          v-if="player.playing || playerLive.playing"
        >
          <i class="el-icon-close"></i>
        </el-button>
        <el-button
          @click="changeExpand()"
          v-if="player.playing || playerLive.playing"
        >
          <i
            :class="{
              'el-icon-arrow-up': !expandMode,
              'el-icon-arrow-down': expandMode,
            }"
          ></i>
        </el-button>
      </div>
    </div>
    <div
      :class="{ 'video-box': true, 'video-box-maximized': expandMode, 'video-box-maximized-collapsed':expandMode&&isCollapse }"
      v-show="player.playing || playerLive.playing"
    >
      <!-- <video ref="mainVideo" controls autoplay>
        <source type="application/x-mpegURL" :src="playUrl" id="videoTarget" />
      </video> -->
      <iframe
        ref="iframeVideo"
        v-if="(player.playing || playerLive.playing) && loadFrame"
        :src="getFullUrl()"
        allowfullscreen="allowfullscreen"
        scrolling="no"
        frameborder="0"
        sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
      ></iframe>
    </div>
  </div>
</template>

<script>
// import videojs from "video.js";
// import "videojs-contrib-hls";
import videoApis from "@/apis/videoApis";
import folderApis from "@/apis/folderApis"
export default {
  name: "PlayerBar",
  components: {},
  mixins: [videoApis,folderApis],
  data() {
    return {
      type: "video",
      expandMode: false,
      aid: "637588808",
      cid: "557147273",
      bvid: "",
      useBvid: false,
      loadFrame: true,
      iframePlayerBaseUrl:
        "//player.bilibili.com/player.html?high_quality=1&autoplay=1&",
      iframePlayerUrlSuffix: "",
      newPlayerBaseUrl:
        "https://www.bilibili.com/blackboard/newplayer.html?high_quality=1&playlist=true&playlist_order=sequential&musth5=1&noEndPanel=0&crossDomain=1&autoplay=1&",
      newPlayerUrlSuffix: "",
      autoSwitchPopup: false,
      activeName: "second",
      livePlayerBaseUrl:
        "https://www.bilibili.com/blackboard/live/live-activity-player.html?quality=0&danmaku=0&",
      livePlayerUrlSuffix: "",
      // type: 80,
      // isMax: true, // 是否点击放大
      // videoObj: null, // 视频播放对象
      // big_size: false, // 放大视频画面
    };
  },
  computed: {
    // playUrl() {
    //   return (
    //     "https://api.bilibili.com/x/player/hls/master.m3u8?aid=" +
    //     this.aid +
    //     "&cid=" +
    //     this.cid +
    //     "&device_type=0&dolby=0&fnval=0&fnver=0&force_host=2&platform=&qn=" +
    //     this.type +
    //     "&qn_category=0&request_type=0"
    //   );
    // },
    player: function () {
      return this.$store.getters.getPlayer;
    },
    playerLive: function () {
      return this.$store.getters.getPlayerLive;
    },
    settings: function () {
      return this.$store.getters.getSettings;
    },  
    isCollapse(){
      return this.$store.state.isCollapse;
    }
  },
  watch: {
    player() {
      // document.frames('iframeVideo').location.reload()
    },
  },
  methods: {
    getTime(timestring) {
      let h = new Date(timestring * 1000).getUTCHours();
      let m = new Date(timestring * 1000).getMinutes();
      let s = new Date(timestring * 1000).getSeconds();
      m = this.checkTime(m);
      s = this.checkTime(s);
      return (h != 0 ? h + ":" : "") + m + ":" + s;
    },
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    getVideoIdInfo() {
      if (this.type == "video") {
        return this.player.useBvid
          ? "bvid=" + this.player.bvid
          : "aid=" + this.player.aid;
      } else if (this.type == "live") {
        return "cid=" + this.playerLive.roomid;
      } else {
        return this.player.useBvid
          ? "bvid=" + this.player.bvid
          : "aid=" + this.player.aid;
      }
    },
    getPageIdInfo() {
      if (this.type == "video") {
        return this.player.usePage
          ? "page=" + this.player.page
          : "cid=" + this.player.cid;
      } else if (this.type == "live") {
        return "";
      } else {
        return this.player.usePage
          ? "page=" + this.player.page
          : "cid=" + this.player.cid;
      }
    },
    getUseDanmaku() {
      if (this.$store.state.config.danmaku) {
        return "danmaku=1";
      } else {
        return "danmaku=0";
      }
    },
    getFullUrl() {
      let baseUrl;
      let suffix;
      if (this.type == "video") {
        baseUrl = this.iframePlayerBaseUrl;
        suffix = this.iframePlayerUrlSuffix;
      } else if (this.type == "live") {
        baseUrl = this.livePlayerBaseUrl;
        suffix = this.livePlayerUrlSuffix;
      } else {
        baseUrl = this.iframePlayerBaseUrl;
        suffix = this.iframePlayerUrlSuffix;
      }
      const video = this.getVideoIdInfo();
      const page = this.getPageIdInfo();
      const danmaku = this.getUseDanmaku();
      const parsedUrl = baseUrl + video + "&" + page + "&" + danmaku + suffix;
      console.log(parsedUrl);
      return parsedUrl;
    },
    changeExpand() {
      this.expandMode ? (this.expandMode = false) : (this.expandMode = true);
    },
    reloadVideo() {
      this.loadFrame = false;
      this.type = "video";
      setTimeout(() => {
        this.loadFrame = true;
      }, 5);
      // this.$refs.iframeVideo.contentWindow.location.reload();
    },
    reloadVideoSimple() {
      this.loadFrame = false;
      this.type = "video";
      setTimeout(() => {
        this.loadFrame = true;
      }, 5);
      // this.$refs.iframeVideo.contentWindow.location.reload();
    },
    reloadLive() {
      this.loadFrame = false;
      this.type = "live";
      setTimeout(() => {
        this.loadFrame = true;
      }, 5);
      // this.$refs.iframeVideo.contentWindow.location.reload();
    },
    popupPlayer() {
      this.autoSwitchPopup = true;
      window.open(
        this.newPlayerBaseUrl +
          this.getVideoIdInfo() +
          "&" +
          this.getPageIdInfo() +
          "&" +
          this.getUseDanmaku() +
          this.newPlayerUrlSuffix,
        "newwindow",
        "height=684, width=1215, top=50, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no"
      );
    },
    play(cid, page) {
      const obj = {
        aid: this.player.aid,
        bvid: this.player.bvid,
        useBvid: false,
        usePage: true,
        page: page,
        cid: cid,
        info: this.player.info,
      };
      console.log(page, obj);
      this.$store.commit("play", obj);
      this.$bus.$emit("reloadVideo", "video");
      if (this.autoSwitchPopup) {
        this.popupPlayer();
      }
    },
    playLive(roomid, uid, info) {
      const obj = {
        roomid: roomid,
        uid: uid,
        info: info,
      };
      console.log(roomid, uid, obj);
      this.$store.commit("playLive", obj);
      this.$bus.$emit("reloadVideo", "live");
    },
    briefParseReturn(text) {
      return text.replace(/[\n]/g, "<br/>");
    },
    stopPlayer() {
      this.$store.commit("stopPlayer");
    },
    // init() {
    //   this.videoObj = videojs(this.$refs.mainVideo, {
    //     bigPlayButton: false,
    //     autoplay: false,
    //     textTrackDisplay: false,
    //     posterImage: true,
    //     errorDisplay: true,
    //     hls: {
    //       withCredentials: true,
    //     },
    //   });
    // },
    // max_window() {
    //   if (this.isMax) {
    //     this.big_size = !this.big_size;
    //   }
    // },
  },
  created() {},
  mounted() {
    // this.$nextTick(() => {
    //   this.init();
    // });
    this.$bus.$on("reloadVideo", (data) => {
      console.log(data);
      if (data == "live") {
        this.reloadLive();
      } else if ((data = "video")) {
        this.reloadVideo();
      }
    });
    this.$bus.$on("reloadVideoSimple", (data) => {
      console.log(data);
      this.getInfos(data.aid + ":2", (res) => {
        const info = res.data.data[0];
        console.log("-------INFO------",info);
        this.getVideoPages(data.aid, (res) => {
          const pages = res.data.data;
          console.log(pages);
          const obj = {
            aid: data.aid,
            bvid: data.bvid,
            useBvid: data.useBvid,
            usePage: data.usePage,
            page: data.page,
            cid: data.cid,
            info: info
          };
          obj.info.pages = pages;
          this.$store.commit("play", obj);
          this.reloadVideoSimple(data);
          // this.$nextTick(() => {
          //   this.$forceUpdate();
          // });
        });
      });
    });
  },
  beforeDestroy() {},
  destroyed() {
    // this.videoObj.dispose()
  },
};
</script>

<style scoped>
/* @import url(https://vjs.zencdn.net/7.11.4/video-js.css); */
.player-bar {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  /* height: 60px; */
  transition: background 0.2s ease;
  z-index: 2;
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
  border: 1px solid #00000020;
  transition: padding-left 0.2s ease;
  overflow: hidden;
}
.bottom-bar-minimized {
  padding-left: calc((60px / 9 * 16) + 20px);
}
.minimized-mode .left{
  width: calc(100% - 122px);
}
.minimized-mode .right{
  width: 122px;
  padding: 10px;
  flex-shrink: 0;
}
.expanded-mode {
  width: 100%;
  height: calc(100vh - 60px);
  background: #fff;
  display: flex;
}
.expanded-mode-collapsed {
  flex-direction: column;
}
.expanded-mode .video-box-template {
  width: calc((100vh - 60px) / 9 * 16);
  height: 100%;
  max-width: calc(100vw - 300px);
}
.expanded-mode .main-content {
  min-width: 300px;
  width: calc(100vw - ((100vh - 60px) / 9 * 16));
  height: 100%;
  /* background: #000; */
  box-sizing: border-box;
  /* padding: 20px; */
  /* background: #fff; */
  overflow: scroll;
  display: flex;
  flex-direction: column;
}

.expanded-mode .video-box-template-collapsed {
  width: 100%;
  max-width: 100%;
  height: calc(100vw / 16 * 9);
}
.expanded-mode .main-content-collapsed {
  min-width: unset;
  width: 100%;
  height: calc(100% - (100vw / 16 * 9));
}
.video-box {
  height: 60px;
  width: calc(60px / 9 * 16);
  background: #000;
  position: fixed;
  top: calc(100vh - 60px);
  left: 0;
  transition: top 0.2s ease, width 0.2s ease, height 0.2s ease;
}
.video-box-maximized {
  height: calc(100vh - 60px);
  width: calc((100vh - 60px) / 9 * 16);
  max-width: calc(100vw - 300px);
  top: 0;
}
.video-box-maximized-collapsed {
  height: calc(100vw / 16 * 9);
  width: 100vw;
  max-width: unset;
  top: 0;
}
.video-box iframe {
  width: 100%;
  height: 100%;
}
.playing-info .title {
  font-size: 0.9em;
  text-overflow:ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
}
.playing-info .sub-title {
  font-size: 1.2em;
  text-overflow:ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  display: flex;
  align-items: center;
}
.playing-info .sub-title .page-number {
  border-radius: 4px;
  background: #eee;
  padding: 3px 7px;
  margin-right: 5px;
  font-size: .7em;
}
.pages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* max-height: 300px; */
  /* overflow: scroll !important; */
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
.pages > .page-playing {
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
.info-header-bar {
  width: 100%;
  padding: 10px 20px;
  position: sticky;
  top: 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  background: #fff;
  box-sizing: border-box;
  z-index: 100;
}
.info-bottom-bar {
  width: 100%;
  padding: 12px 20px;
  position: sticky;
  bottom: 0;
  border-top: 1px solid #eee;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.title-box {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-direction: column;
  gap: 10px;
}
.title-box .title {
  font-weight: 800;
}
.title-box .info {
  font-size: 0.8em;
}
</style>