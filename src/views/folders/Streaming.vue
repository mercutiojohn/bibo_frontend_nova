<template>
  <div class="streaming">
    <transition-group name="el-fade-in">
      <div class="item-list" v-infinite-scroll="loads" v-if="!loading" key="1">
        <el-card
          class="box-card live-item"
          v-for="(item, index) in liveList"
          :key="index"
        >
          <div slot="header" class="card-header">
            <a :href="'https://space.bilibili.com/' + item.uid" target="_blank">
              <div class="upper">
                <div class="avatar">
                  <!-- <span class="info">up主头像：{{ item.face }}</span> -->
                  <img v-lazy="item.based_face" alt="" srcset="" />
                </div>
                <div class="up-info">
                  <span class="info">{{ item.uname }}</span>
                  <span class="uid inactive-text select-enable">{{
                    item.uid
                  }}</span>
                </div>
              </div>
            </a>
            <div class="header-right">
              <a :href="item.link" target="_blank"
                ><el-button style="float: right; padding: 3px 0" type="text">
                  <i class="el-icon-link"></i>
                  网页打开
                </el-button>
              </a>
              <a
                :href="livePlayerBaseUrl + getUseDanmaku() + '&' + item.roomid"
                target="_blank"
                ><el-button style="float: right; padding: 3px 0" type="text">
                  <i class="el-icon-link"></i>
                  纯享播放器
                </el-button>
              </a>
              <a :href="'bilibili://live/' + item.roomid" target="_blank"
                ><el-button style="float: right; padding: 3px 0" type="text">
                  <i class="el-icon-top-right"></i>
                  本地打开
                </el-button>
              </a>
            </div>
          </div>
          <div
            class="item-details floated"
            @click="playLive(item.roomid, item.uid, item)"
          >
            <div class="left">
              <div class="cover">
                <img v-lazy="item.based_pic" alt="" srcset="" />
              </div>
            </div>
            <div class="right">
              <div class="title">
                <span class="info">{{ item.title }}</span>
              </div>
              <div class="infos">
                <span class="info inactive-text select-enable">{{
                  item.roomid
                }}</span>
                <span class="info"
                  >{{ indexedAreas[item.parent_area_id].name }} ·
                  {{
                    indexedAreas[item.parent_area_id].list[item.area_id].name
                  }}</span
                >
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="观看人数"
                  placement="top-start"
                >
                  <span class="info">
                    <i class="el-icon-user"></i>
                    {{ parseNumber(item.online) }}
                  </span></el-tooltip
                >
              </div>
            </div>
          </div>
          <!-- <div class="bg">
            <div class="bg-box">
              <img class="blur-bg" v-lazy="item.based_cover" alt="" srcset="" />
            </div>
          </div> -->
          <!-- <div class="extra-info">
              <span class="info">up主名称：{{ item.uname }}</span>
              <span class="info">up主头像：{{ item.face }}</span>
              <span class="info">up主uid：{{ item.uid }}</span>
              <span class="info">房间号：{{ item.roomid }}</span>
              <span class="info">标题：{{ item.title }}</span>
              <span class="info">分区号：{{ item.area_id }}</span>
              <span class="info">父分区号：{{ item.parent_area_id }}</span>
              <span class="info">直播封面cover（up主头像）：{{ item.cover }}</span>
              <span class="info">直播封面pic：{{ item.pic }}</span>
              <span class="info">链接：{{ item.link }}</span>
              <span class="info">在线人数：{{ item.online }}</span>
            </div> -->
        </el-card>
        <el-card class="box-card" v-if="subLoading == true">
          <div slot="header" class="card-header-loading">
            <el-skeleton :rows="2" animated />
          </div>
          <div class="item-details-loading">
            <el-skeleton :rows="4" animated />
          </div>
        </el-card>
        <el-card class="box-card" v-if="subLoading == true">
          <div slot="header" class="card-header-loading">
            <el-skeleton :rows="2" animated />
          </div>
          <div class="item-details-loading">
            <el-skeleton :rows="4" animated />
          </div>
        </el-card>
      </div>
      <div v-else key="2">
        <div class="item-list skeleton">
          <el-card class="box-card">
            <div slot="header" class="card-header-loading">
              <el-skeleton :rows="2" animated />
            </div>
            <div class="item-details-loading">
              <el-skeleton :rows="4" animated />
            </div>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="card-header-loading">
              <el-skeleton :rows="2" animated />
            </div>
            <div class="item-details-loading">
              <el-skeleton :rows="4" animated />
            </div>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="card-header-loading">
              <el-skeleton :rows="2" animated />
            </div>
            <div class="item-details-loading">
              <el-skeleton :rows="4" animated />
            </div>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="card-header-loading">
              <el-skeleton :rows="2" animated />
            </div>
            <div class="item-details-loading">
              <el-skeleton :rows="4" animated />
            </div>
          </el-card>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import tools from "@/mixin/tools";
import shareUtils from "@/mixin/shareUtils";
import playUtils from "@/mixin/playUtils";
import getPicUtils from "@/mixin/getPicUtils";
import liveApis from "@/apis/liveApis";
export default {
  name: "Streaming",
  components: {},
  mixins: [shareUtils, playUtils, tools, getPicUtils, liveApis],
  data() {
    return {
      loading: true,
      pageSize: 20,
      pageNumber: 1,
      empty: false,
      subLoading: false,
      count: 0,

      liveList: [],
      liveAreas: [],
      indexedAreas: [],
      livePlayerBaseUrl:
        "https://www.bilibili.com/blackboard/live/live-activity-player.html?quality=0&",
    };
  },
  computed: {
    settings: function () {
      return this.$store.getters.getSettings;
    },
  },
  watch: {},
  methods: {
    getUseDanmaku() {
      if (this.$store.state.config.danmaku) {
        return "danmaku=1";
      } else {
        return "danmaku=0";
      }
    },
    loadLiveList(pn, ps, start, end) {
      this.getLiveList(pn, ps, start, end, (res) => {
        // console.log(res.data);
        for (let item of res.data.data.list) {
          this.liveList.push(item);
        }
        setTimeout(() => {
          this.loadPic(start, end, this.liveList, "pic");
          this.loadPic(start, end, this.liveList, "face");
        }, 100);
        this.loading = false;
        this.subLoading = false;
      });
    },
    getLoad() {
      const data = {
        cookies: this.settings.cookies,
        pn: "1",
        ps: "1",
      };
      const options = {
        data: this.qs.stringify(data),
        url: "/live/live_list",
      };
      this.$api(options).then((res) => {
        this.count = res.data.data.results;
        this.getLoadPage();
      });
    },
    loads() {
      if (!this.subLoading) {
        this.getLoad();
        this.subLoading = true;
      }
    },
    getLoadPage() {
      let page = this.pageNumber;
      const length = this.count;
      console.log(length);
      const pageSize = this.pageSize;
      let start = (page - 1) * pageSize;
      let end = (page - 1) * pageSize + pageSize;
      if (start == length) {
        this.empty = true;
        // this.subLoading = false;
        return null;
      } else if (start > length) {
        // this.subLoading = false;
        return null;
      }
      this.subLoading = true;
      console.log(end, ">", length, end > length);
      if (end > length) {
        console.log("end changed from", end, "to", length);
        end = length;
      }
      console.log(
        "当前页码：",
        page,
        "每页个数：",
        pageSize,
        "index：",
        start,
        "-",
        end
      );
      this.loadLiveList(page, pageSize, start, end);
      //   this.loading = false;
      this.pageNumber++;
    },
    getLiveAreas() {
      const data = {
        cookies: this.settings.cookies,
      };
      const options = {
        data: this.qs.stringify(data),
        url: "/live/live_area_list",
      };
      this.$api(options).then((res) => {
        console.log(res.data);
        this.liveAreas = res.data.data.data;
        this.parseAreas();
      });
    },
    parseAreas() {
      for (let i in this.liveAreas) {
        console.log("live-list", i, this.liveAreas[i].id);
        this.indexedAreas[this.liveAreas[i].id] = this.deepCopy(
          this.liveAreas[i]
        );
        this.indexedAreas[this.liveAreas[i].id].list = [];
        for (let j in this.liveAreas[i].list) {
          console.log("live-sublist", j, this.liveAreas[i].list[j].id);
          this.indexedAreas[this.liveAreas[i].id].list[
            this.liveAreas[i].list[j].id
          ] = this.deepCopy(this.liveAreas[i].list[j]);
        }
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
  },

  created() {},
  mounted() {
    this.getLoad();
    this.getLiveAreas();
  },
  beforeDestroy() {},
};
</script>

<style scoped>
.streaming {
  padding: 20px;
}
.extra-info {
  display: flex;
  flex-direction: column;
  display: none;
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
  align-items: flex-start;
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
.item-details {
  display: flex;
  /* flex-direction: column; */
  gap: 20px;
  /* height: 100%; */
  padding: 15px;
  cursor: pointer;
  /* backdrop-filter: blur(100px); */
}
.item-details:hover {
  background: #eee;
}
.item-details .cover {
  --width: 200px;
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
  width: calc(100% - 200px);
  gap: 10px;
}
.item-details .right .infos {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.8em;
}
.item-details .right .title {
  font-size: 1.1em;
}
.item-details .right .infos .brief {
  font-size: 0.85em;
  text-overflow: ellipsis;
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
.item-list {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
}
.skeleton {
  position: fixed;
  top: calc(61px + 20px);
  left: calc(var(--side-width) + 20px);
  width: calc(100vw - var(--side-width) - 40px);
}
.header-right {
  display: flex;
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
.streaming .el-card__header {
  padding: 15px;
}
.streaming .el-card__body {
  padding: 0;
}
</style>