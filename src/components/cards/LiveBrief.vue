<template>
  <div class="live-brief">
    <div class="live-brief-list">
      <div
        class="live-item"
        v-for="(item, index) in liveBriefList"
        :key="index"
        @click="playLive(item.link,item.uid,item)"
      >
        <div class="avatar">
          <img v-lazy="item.based_face" alt="" srcset="" />
        </div>
        <div class="details">
          <span class="uname">{{ item.uname }}</span>
          <span class="title">{{ item.title }}</span>
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
export default {
  name: "LiveBrief",
  components: {},
  data() {
    return {
      liveBriefList: [],
      size: 10,
    };
  },
  computed: {
    settings: function () {
      return this.$store.getters.getSettings;
    },
  },
  watch: {},
  methods: {
    parseRoomId(text) {
      return text
        .replace("https://live.bilibili.com/", "")
        .replace("?broadcast_type=0", "");
    },
    getLiveBriefList(size) {
      const data = {
        cookies: this.settings.cookies,
        size: size,
      };
      const options = {
        data: this.qs.stringify(data),
        url: "/live/live_brief_list",
      };
      this.$api(options).then((res) => {
        console.log(res.data);
        this.liveBriefList = res.data.data.items;
        for (let i = 0; i < size; i++) {
          this.getCover(this.liveBriefList[i].face, "face", i);
          this.liveBriefList[i].link = this.parseRoomId(
            this.liveBriefList[i].link
          );
        }
      });
    },
    getCover(url, type, index) {
      if (this.loading) return;
      let o_cover_url = url;
      if (type == "video") {
        if (this.liveBriefList[index].parsed_cover == true) {
          return this.liveBriefList[index].based_cover;
        } else {
          o_cover_url = o_cover_url + "@351w_219h_1c_100q.webp";
          this.getBasedPic(o_cover_url, (res) => {
            this.liveBriefList[index].based_cover =
              "data:image/png;base64," + res.data;
            this.liveBriefList[index].parsed_cover = true;
            this.$nextTick(() => {
              this.$forceUpdate();
              //   console.log("based cover", index);
            });
          });
          return this.liveBriefList[index].based_cover;
        }
      } else if (type == "face") {
        if (this.liveBriefList[index].parsed_face == true) {
          return this.liveBriefList[index].based_face;
        } else {
          o_cover_url = o_cover_url + "@200w_200h_1c_100q.webp";
          this.getBasedPic(o_cover_url, (res) => {
            this.liveBriefList[index].based_face =
              "data:image/png;base64," + res.data;
            this.liveBriefList[index].parsed_face = true;
            this.$nextTick(() => {
              this.$forceUpdate();
              //   console.log("based face", index);
            });
          });
          return this.liveBriefList[index].based_face;
        }
      }
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
    playLive(roomid,uid,info){
    const obj = {
        roomid: roomid,
        uid: uid,
        info: info,
      };
      console.log(roomid, uid, obj);
      this.$store.commit("playLive", obj);
      this.$bus.$emit("reloadVideo", "live");
    }
  },
  created() {},
  mounted() {
    this.getLiveBriefList(this.size);
  },
  beforeDestroy() {},
};
</script>

<style scoped>
.live-brief-list {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
.live-item {
  padding: 15px;
  display: flex;
  /* flex-direction: column; */
  align-items: flex-start;
  border-radius: 10px;
  background: #fff;
  gap:15px;
  cursor: pointer;
  transition: transform .1s ease, box-shadow .2s ease;
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
  width: 80px;
  height: 80px;
  border-radius: 5px;
  overflow: hidden;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.live-item .details{
  display: flex;
  flex-direction: column;
  width: calc(100% - 80px - 15px);
  gap:5px;
}
.live-item .title{
    font-size: .9em;
}
.live-item .uname{
    font-weight: bold;
    font-size: 1.1em;
}
</style>