<template>
  <div :class="{ 'player-bar': true, 'player-bar-maximized': expandMode }">
    <transition name="el-zoom-in-bottom">
      <div class="expanded-mode" v-show="expandMode && player.playing">
        <div class="video-box-template"></div>
        <div class="main-content">
          <el-button @click="popupPlayer">弹出窗口看高清</el-button>
          <el-checkbox v-model="autoSwitchPopup"
            >自动切换弹出窗口视频</el-checkbox
          >
          <span>视频列表</span>
          <div class="pages">
            <div
              class="page"
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
        </div>
      </div>
    </transition>
    <div
      :class="{
        'minimized-mode': true,
        'bottom-bar-minimized': !expandMode && player.playing,
      }"
    >
      <div class="left">
        <div class="playing-info" v-if="player.playing">
          <div class="sub-title">
            {{ player.page }}.{{
              player.info.pages[Number(player.page) - 1].part
            }}
          </div>
          <div class="title">{{ player.info.title }}</div>
          <div class="upper-name inactive-text">
            {{ player.info.upper.name }}
          </div>
        </div>
        <div class="playing-info-not-playing" v-else>
          <div class="title inactive-text">未在播放</div>
        </div>
      </div>
      <div class="center">
        <!-- <div class="progress">456</div> -->
      </div>
      <div class="right">
        <div class="funcs"></div>
        <div class="playlist"></div>
        <el-button @click="changeExpand()" v-if="player.playing">
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
      :class="{ 'video-box': true, 'video-box-maximized': expandMode }"
      v-show="player.playing"
    >
      <!-- <video ref="mainVideo" controls autoplay>
        <source type="application/x-mpegURL" :src="playUrl" id="videoTarget" />
      </video> -->
      <iframe
        ref="iframeVideo"
        v-if="player.playing && loadFrame"
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
export default {
  name: "PlayerBar",
  components: {},
  data() {
    return {
      expandMode: false,
      aid: "637588808",
      cid: "557147273",
      bvid: "",
      useBvid: false,
      loadFrame: true,
      iframePlayerBaseUrl:
        "//player.bilibili.com/player.html?high_quality=1&danmaku=0&",
      iframePlayerUrlSuffix: "",
      newPlayerBaseUrl:
        "https://www.bilibili.com/blackboard/newplayer.html?high_quality=1&danmaku=0&playlist=true&playlist_order=sequential&musth5=1&noEndPanel=0&crossDomain=1&autoplay=1&",
      newPlayerUrlSuffix: "",
      autoSwitchPopup: false,
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
      return this.player.useBvid
        ? "bvid=" + this.player.bvid
        : "aid=" + this.player.aid;
    },
    getPageIdInfo() {
      return this.player.usePage
        ? "page=" + this.player.page
        : "cid=" + this.player.cid;
    },
    getFullUrl() {
      const video = this.getVideoIdInfo();
      const page = this.getPageIdInfo();
      const parsedUrl =
        this.iframePlayerBaseUrl +
        video +
        "&" +
        page +
        this.iframePlayerUrlSuffix;
      console.log(parsedUrl);
      return parsedUrl;
    },
    changeExpand() {
      this.expandMode ? (this.expandMode = false) : (this.expandMode = true);
    },
    reloadVideo() {
      this.loadFrame = false;
      setTimeout(() => {
        this.loadFrame = true;
      }, 5);
      // this.$refs.iframeVideo.contentWindow.location.reload();
    },
    popupPlayer() {
      window.open(
        this.newPlayerBaseUrl +
          this.getVideoIdInfo() +
          "&" +
          this.getPageIdInfo() +
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
      this.$bus.$emit("reloadVideo", "test");
      if (this.autoSwitchPopup) {
        this.popupPlayer();
      }
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
      console.log("got massage");
      this.reloadVideo();
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
}
.bottom-bar-minimized {
  padding-left: calc((60px / 9 * 16) + 20px);
}
.expanded-mode {
  width: 100%;
  height: calc(100vh - 60px);
  background: #fff;
  display: flex;
}
.expanded-mode .video-box-template {
  width: calc((100vh - 60px) / 9 * 16);
  height: calc(100vh - 60px);
  max-width: calc(100vw - 300px);
}
.expanded-mode .main-content {
  min-width: 300px;
  width: calc(100vw - ((100vh - 60px) / 9 * 16));
  height: calc(100vh - 60px);
  /* background: #000; */
  box-sizing: border-box;
  padding: 20px;
  /* background: #fff; */
  overflow: scroll;
  display: flex;
  flex-direction: column;
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
.video-box iframe {
  width: 100%;
  height: 100%;
}
.playing-info .title {
  font-size: 0.8em;
}
.playing-info .sub-title {
  font-size: 0.9em;
}
.pages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* max-height: 300px; */
  /* overflow: scroll !important; */
  background: #fafafa;
  padding: 10px 6px;
  border-radius: 10px;
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