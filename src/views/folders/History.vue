<template>
  <div class="history">
    <transition-group name="el-fade-in">
      <div
        :class="{'item-list':true,'item-list-collapsed':isCollapse}"
        v-infinite-scroll="loads"
        v-if="!loading"
        key="1"
        infinite-scroll-immediate="false"
      >
        <el-card
          class="box-card history-item"
          v-for="(item, index) in historyList"
          :key="index"
        >
          <!-- <span class="select-enable">{{item}}</span> -->
          <div slot="header" class="card-header">
            <el-link
              class="title"
              @click="playSimple(item.aid, item.bvid, item.cid, item.page.page)"
              >{{ item.title }}</el-link
            >
            <div class="header-right">
              <a
                :href="'https://www.bilibili.com/video/' + item.bvid"
                target="_blank"
                ><el-button style="float: right; padding: 3px 0" type="text">
                  <i class="el-icon-link"></i>
                  网页
                </el-button>
              </a>
              <!-- <a
                :href="
                  'https://www.bilibili.com/blackboard/newplayer.html?high_quality=1&danmaku=0&playlist=true&playlist_order=sequential&musth5=1&noEndPanel=0&crossDomain=1&autoplay=1&aid=' +
                  item.aid +
                  '&page=1'
                "
                target="_blank"
                ><el-button style="float: right; padding: 3px 0" type="text">
                  <i class="el-icon-link"></i>
                  纯享播放器
                </el-button>
              </a> -->
              <a :href="'bilibili://video/' + item.aid" target="_blank"
                ><el-button style="float: right; padding: 3px 0" type="text">
                  <i class="el-icon-top-right"></i>
                  本地
                </el-button>
              </a>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="
                  share(
                    item.title,
                    'https://www.bilibili.com/video/' + item.bvid,
                    item.desc,
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
          <div :class="{'item-details':true, 'floated':true,'item-details-collapsed':isCollapse}" @click="playSimple(item.aid, item.bvid, item.cid, item.page.page)">
            <div class="left">
              <div class="cover">
                <img v-lazy="item.based_pic" alt="" srcset="" />
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
                    <span class="info">共{{ item.count }}个视频</span>
                  </div>
                </el-tooltip>
                <!-- <el-tooltip
                  class="item"
                  effect="dark"
                  :content="(item.favorite?'已收藏':'未收藏')+', 收藏数'"
                  placement="top-start"
                >
                  <span class="info">
                    <i :class="{'icon':true, 'el-icon-star-off':!item.favorite,'el-icon-star-on':item.favorite}"></i>
                    <span class="data">{{
                      parseNumber(item.stat.favorite)
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
                      parseNumber(item.stat.danmaku)
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
                      parseNumber(item.stat.view)
                    }}</span>
                  </span>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="投币"
                  placement="top-start"
                >
                  <span class="info">
                    <i class="icon el-icon-coin"></i>
                    <span class="data">{{
                      parseNumber(item.stat.coin)
                    }}</span>
                  </span>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="评论"
                  placement="top-start"
                >
                  <span class="info">
                    <i class="icon el-icon-chat-line-square"></i>
                    <span class="data">{{
                      parseNumber(item.stat.reply)
                    }}</span>
                  </span>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="分享"
                  placement="top-start"
                >
                  <span class="info">
                    <i class="icon el-icon-share"></i>
                    <span class="data">{{
                      parseNumber(item.stat.share)
                    }}</span>
                  </span>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="点赞"
                  placement="top-start"
                >
                  <span class="info">
                    <i class="icon el-icon-thumb"></i>
                    <span class="data">{{
                      parseNumber(item.stat.like)
                    }}</span>
                  </span>
                </el-tooltip> -->
              </div>
            </div>
            <div :class="{'right':true,'right-collapsed':isCollapse}">
              <div class="infos">
                <!-- <span
                  class="info inactive-text select-enable"
                  v-html="briefParseReturn(item.desc)"
                ></span> -->
                <span class="info" v-if="item.page">
                  <span class="page-number">{{ item.page.page }}</span>
                  <span class="title">{{ item.page.part }}</span>
                </span>
                <!-- <span class="info">
                  {{ item.page ? getTime(item.page.duration) : "无信息" }}
                </span> -->

                <span class="info">{{ item.tname }}</span>
                <div class="duration-stats" v-if="item.progress != -1">
                  <span class="info">{{ getTime(item.progress) }}</span>
                  <span class="info">{{ getTime(item.duration) }}</span>
                </div>
                <div class="duration" v-if="item.progress != -1">
                  <div
                    class="duration-bar"
                    :style="
                      'width:' + (item.progress / item.duration) * 100 + '%'
                    "
                  ></div>
                </div>
                <div v-else>
                  <span class="info">已看完</span>
                </div>
                <!-- <el-tooltip
                  class="item"
                  effect="dark"
                  content="观看人数"
                  placement="top-start"
                >
                  <span class="info">
                    <i class="el-icon-user"></i>
                    {{ parseNumber(item.online) }}
                  </span></el-tooltip
                > -->
              </div>
            </div>
          </div>
          <div class="bottom floated">
            <a
              :href="'https://space.bilibili.com/' + item.owner.mid"
              target="_blank"
            >
              <div class="upper">
                <div class="avatar">
                  <img v-lazy="item.owner.based_face" alt="" srcset="" />
                </div>
                <div class="up-info">
                  <span class="info">{{ item.owner.name }}</span>
                  <span class="info uid inactive-text select-enable">{{
                    item.owner.mid
                  }}</span>
                </div>
              </div>
            </a>
            <div class="time-stats">
              <!-- <span class="info">收藏时间:{{ item.ctime }}</span> -->

              <span class="info inactive-text select-enable">{{
                item.bvid
              }}</span>
              <div class="times-info">
                <span class="info inactive-text">
                  <i class="el-icon-view"></i>
                  <span class="info"> {{ getDate(item.view_at) }}</span>
                </span>
                <span class="info inactive-text">
                  <i class="el-icon-upload2"></i>
                  <span class="info"> {{ getDate(item.pubdate) }}</span>
                </span>
              </div>
              <span class="info">
                {{ item.device }}
                <i
                  :class="{
                    'el-icon-mobile': item.device == 1,
                    'el-icon-mobile': item.device == 3,
                    'el-icon-mobile': item.device == 5,
                    'el-icon-mobile': item.device == 7,
                    'el-icon-monitor': item.device == 2,
                    'el-icon-monitor': item.device == 4,
                    'el-icon-monitor': item.device == 6,
                    'el-icon-monitor': item.device == 33,
                    'el-icon-monitor': item.device == 0,
                    'el-icon-monitor': item.device == 8,
                  }"
                ></i>
              </span>
              <!-- 1 3 5 7：手机端
                2：web端
                4 6：pad端
                33：TV端
                0：其他 -->
            </div>
          </div>

          <!-- <div class="bg">
            <div class="bg-box">
              <img class="blur-bg" v-lazy="item.based_cover" alt="" srcset="" />
            </div>
          </div> -->
          <div class="extra-info">
            <span class="info">视频标题：{{ item.title }}</span>
            <span class="info">简介：{{ item.desc }}</span>
            <span class="info">up主：{{ item.owner }}</span>
            <p class="up">
              <span class="info">up主名称：{{ item.owner.name }}</span>
              <span class="info">up主uid：{{ item.owner.mid }}</span>
              <span class="info">up主头像url：{{ item.owner.face }}</span>
            </p>
            <span class="info">类型：{{ item.business }}</span>
            <span class="info">类型：{{ item.type }}</span>
            <span class="info">子类型：{{ item.sub_type }}</span>
            <span class="info">版权：{{ item.copyright }}</span>
            <span class="info">bvid：{{ item.bvid }}</span>
            <span class="info">aid：{{ item.aid }}</span>
            <span class="info">cid：{{ item.cid }}</span>
            <span class="info">kid：{{ item.kid }}</span>
            <span class="info">视频长宽：{{ item.dimension }}</span>
            <span class="info">观看时间(view_at)：{{ item.view_at }}</span>
            <span class="info">设备类型：{{ item.device }}</span>
            <span class="info">发布时间(pubdate)：{{ item.pubdate }}</span>
            <span class="info">观看时间(ctime)：{{ item.ctime }}</span>
            <span class="info">观看进度：{{ item.progress }}</span>
            <span class="info">总时长：{{ item.duration }}</span>
            <span class="info">是否收藏：{{ item.favorite }}</span>
            <span class="info">视频总数：{{ item.count }}</span>
            <p class="page" v-if="item.page">
              <span class="info">分p信息：{{ item.page }}</span>
              <span class="info">cid：{{ item.page.cid }}</span>
              <span class="info"
                >分p标题：{{ item.page.part ? item.page.part : "无信息" }}</span
              >
              <span class="info"
                >分p时长：{{
                  item.page.duration ? item.page.duration : "无信息"
                }}</span
              >
            </p>
            <span class="info">第一帧url：{{ item.first_frame }}</span>
            <span class="info">封面url：{{ item.pic }}</span>
            <span class="info">跳转链接：{{ item.redirect_link }}</span>
            <span class="info">跳转短链接：{{ item.short_link_v2 }}</span>
            <p class="stat">
              <span class="info">视频状态：{{ item.stat }}</span>
              <span class="info">aid：{{ item.stat.aid }}</span>
              <span class="info">投币：{{ item.stat.coin }}</span>
              <span class="info">弹幕：{{ item.stat.danmaku }}</span>
              <span class="info">收藏：{{ item.stat.favorite }}</span>
              <span class="info">点赞：{{ item.stat.like }}</span>
              <span class="info">评论：{{ item.stat.reply }}</span>
              <span class="info">分享：{{ item.stat.share }}</span>
              <span class="info">观看人数：{{ item.stat.view }}</span>
              <span class="info">历史排名：{{ item.stat.his_rank }}</span>
              <span class="info">当前排名：{{ item.stat.now_rank }}</span>
            </p>
            <span class="info">权限：{{ item.rights }}</span>
            <span class="info">state：{{ item.state }}</span>
            <span class="info">分区id：{{ item.tid }}</span>
            <span class="info">分区名称：{{ item.tname }}</span>
            <span class="info">视频个数：{{ item.videos }}</span>
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
        <div :class="{'item-list':true, 'item-list-collapsed':isCollapse, 'skeleton':true, 'skeleton-collapsed':isCollapse}">
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
import historyApis from "@/apis/historyApis";
export default {
  name: "History",
  components: {},
  mixins: [shareUtils, playUtils, tools, getPicUtils,historyApis],
  data() {
    return {
      loading: true,
      pageSize: 10,
      pageNumber: 1,
      empty: false,
      subLoading: false,
      count: 0,

      historyList: [],
      waitingLoad: false,
    };
  },
  computed: {
    settings: function () {
      return this.$store.getters.getSettings;
    },
    isCollapse(){
      return this.$store.state.isCollapse;
    }
  },
  watch: {},
  methods: {
    loads() {
      this.subLoading = true;
      if (!this.waitingLoad) {
        console.log("load");
        this.getLoad();
        this.waitingLoad = true;
      }
    },
    getLoad() {
      const data = {
        cookies: this.settings.cookies,
        pn: this.pageNumber,
        ps: this.pageSize,
      };
      const options = {
        data: this.qs.stringify(data),
        url: "/history/history_info",
      };
      this.$api(options).then((res) => {
        console.log(res.data.data);
        // this.count += res.data.data.length;
        this.count += this.pageSize;
        this.getLoadPage();
      });
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
      this.loadHistoryList(page, pageSize, start, end);
      this.pageNumber++;
    },
    loadHistoryList(pn, ps, start, end){
      this.getHistoryList(pn, ps, (res) => {
        // console.log(res.data);
        for (let item of res.data.data) {
          this.historyList.push(item);
        }
        setTimeout(() => {
          this.loadPic(start, end, this.historyList, "pic");
          this.loadSubPic(start, end, this.historyList, "owner", "face");
        }, 100);
        this.loading = false;
        this.subLoading = false;
        setTimeout(() => {
          this.waitingLoad = false;
        }, 100);
      })
    },
  },

  created() {},
  mounted() {
    this.getLoad();
  },
  beforeDestroy() {},
};
</script>

<style scoped>
.history {
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
.item-details-collapsed{
  flex-direction: column;
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
.item-details > .right-collapsed{
  width:100%;
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
.item-list-collapsed {
  display: flex;
  gap: 10px;
  flex-direction: column;
}
.skeleton {
  position: fixed;
  top: calc(var(--head-height) + 20px);
  left: calc(var(--side-width) + 20px);
  width: calc(100vw - var(--side-width) - 40px);
}
.skeleton-collapsed{
  left: calc(var(--side-collapse-width) + 20px);
  width: calc(100vw - var(--side-collapse-width) - 40px);
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
  flex-shrink: 0;
  padding: 10px;
  box-sizing: border-box;
  bottom: 0;
  background: #ffffff96;
}
.time-stats {
  /* text-align: right; */
  display: flex;
  gap: 10px;
  font-size: 0.8em;
  align-items: center;
}
.time-stats .times-info {
  display: flex;
  flex-direction: column;
}
.duration {
  background: #eee;
  width: 100%;
  height: 5px;
  border-radius: 3px;
  overflow: hidden;
}
.duration-bar {
  background: var(--accent-color);
  height: 100%;
  border-radius: 3px;
}
.duration-stats {
  display: flex;
  justify-content: space-between;
}
.page-number {
  border-radius: 5px;
  background: #eee;
  padding: 3px 7px;
  margin-right: 5px;
}
.item-details .right .infos {
  font-size: 0.85em;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}
</style>
<style>
.history .el-card {
  display: flex;
  flex-direction: column;
  /* box-shadow: 0 10px 20px 8px #fff!important; */
}
.history .el-card__header {
  padding: 20px;
}
.history .el-card__body {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.history .el-collapse-item__header {
  box-sizing: border-box;
  padding: 0 10px;
}

.history .el-collapse {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #eee;
}

.history .el-collapse-item__content {
  padding-bottom: 0;
}
</style>