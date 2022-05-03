<template>
  <div class="history-brief">
    <div class="history-brief-list">
      <div
        class="live-item"
        v-for="(item, index) in historyList"
        :key="index"
        @click="playSimple(item.aid, item.bvid, item.page.cid, 1)"
      >
        <div class="avatar">
          <img v-lazy="item.based_pic" alt="" srcset="" />
        </div>
        <div class="duration" v-if="item.progress != -1">
          <div
            class="duration-bar"
            :style="'width:' + (item.progress / item.duration) * 100 + '%'"
          ></div>
        </div>
        <div class="duration-end" v-else>
          <span class="info">已看完</span>
        </div>
        <div class="duration-stats" v-if="item.progress != -1">
          <span class="info">{{ getTime(item.progress) }}</span>
          <span class="info">{{ getTime(item.duration) }}</span>
        </div>
        <div class="details">
          <span class="uname">{{ item.title }}</span>
          <span class="title">{{ item.owner.name }}</span>
          <span class="title"
            >看到{{ item.page.page }} - {{ item.page.part }}</span
          >
        </div>
        <!-- <div class="extra-info">
          <span class="info">up主头像：{{ item.face }}</span>
          <span class="info">链接：{{ item.link }}</span>
          <span class="info">标题：{{ item.title }}</span>
          <span class="info">up主头像：{{ item.uid }}</span>
          <span class="info">up主名称：{{ item.uname }}</span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import tools from "@/mixin/tools";
import shareUtils from "@/mixin/shareUtils";
import playUtils from "@/mixin/playUtils";
import getPicUtils from "@/mixin/getPicUtils";
import historyApis from "@/apis/historyApis";
export default {
  name: "HistoryBrief",
  components: {},
  mixins: [shareUtils, playUtils, tools, getPicUtils, historyApis],
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
    loadHistoryList(pn, ps, start, end) {
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
      });
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
.history-brief-list {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.live-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.2s ease;
  overflow: hidden;
}
.live-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px 2px #00000026;
}
.live-item:active {
  transform: translateY(0px);
  box-shadow: 0 2px 5px 1px #00000026;
}
.avatar {
  width: 100%;
  height: 120px;
  overflow: hidden;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.live-item .details {
  padding: 4px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.live-item .title {
  font-size: 0.8em;
}
.live-item .uname {
  font-weight: bold;
}
.duration {
  background: #eee;
  width: 100%;
  height: 5px;
  border-radius: 3px;
  overflow: hidden;
}
.duration-end{
  font-size: .8em;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 20px;
}
.duration-end .info{
  border-radius: 5px;
  padding: 5px;
  background: #eee;
}
.duration-bar {
  background: var(--accent-color);
  height: 100%;
  border-radius: 3px;
}
.duration-stats {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  box-sizing: border-box;
  font-size: .7em;
}
</style>