<template>
<div class="quick-look">
    <!-- {{live_users}} -->
    <!-- {{special_follows}} -->
    <div class="live-brief-list">
      <div
        class="live-item"
        v-for="(item, index) in special_follows"
        :key="index"
      >
      <!-- @click="playLive(item.link,item.uid,item)" -->
        <div class="avatar">
          <img v-lazy="item.based_face" alt="" srcset="" />
        </div>
        <span class="uname">{{ item.uname }}</span>
        <span class="title">{{ item.has_update }}</span>
        <!-- <div class="extra-info">
          <span class="info">{{item.uname}}</span>
            <span class="info">{{item.mid}}</span>
            <span class="info">{{item.has_update}}</span>
            <span class="info">{{item.face}}</span>
        </div> -->
      </div>
    </div>
</div>
</template>

<script>
export default {
name: "",
components: {},
data() {
return {
    quick_looks:{},
    live_users:[],
    live_users_count:0,
    special_follows:[],
    my_info:{}
};
},
computed: {
    settings: function () {
      return this.$store.getters.getSettings;
    },
},
watch: {},
methods: {
    getCover(url, type, index) {
      if (this.loading) return;
      let o_cover_url = url;
      if (type == "video") {
        if (this.special_follows[index].parsed_cover == true) {
          return this.special_follows[index].based_cover;
        } else {
          o_cover_url = o_cover_url + "@351w_219h_1c_100q.webp";
          this.getBasedPic(o_cover_url, (res) => {
            this.special_follows[index].based_cover =
              "data:image/png;base64," + res.data;
            this.special_follows[index].parsed_cover = true;
            this.$nextTick(() => {
              this.$forceUpdate();
              //   console.log("based cover", index);
            });
          });
          return this.special_follows[index].based_cover;
        }
      } else if (type == "face") {
        if (this.special_follows[index].parsed_face == true) {
          return this.special_follows[index].based_face;
        } else {
          o_cover_url = o_cover_url + "@200w_200h_1c_100q.webp";
          this.getBasedPic(o_cover_url, (res) => {
            this.special_follows[index].based_face =
              "data:image/png;base64," + res.data;
            this.special_follows[index].parsed_face = true;
            this.$nextTick(() => {
              this.$forceUpdate();
              //   console.log("based face", index);
            });
          });
          return this.special_follows[index].based_face;
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
    getQuickLookList(size) {
      const data = {
        cookies: this.settings.cookies,
      };
      const options = {
        data: this.qs.stringify(data),
        url: "/subscribes/quick_looks",
      };
      this.$api(options).then((res) => {
        console.log(res.data);
        this.quick_looks = res.data;
        this.live_users = res.data.data.live_users.items;
        this.live_users_count = res.data.data.live_users.count;
        this.special_follows = res.data.data.up_list;
        this.my_info = res.data.data.my_info;
        for (let i = 0; i < this.special_follows.length; i++) {
            this.getCover(this.special_follows[i].face, "face", i);
        }
      });
    },
},
created(){},
mounted(){
    this.getQuickLookList();
},
beforeDestroy(){}
};
</script>

<style scoped>
.live-brief-list {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.live-item {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  background: #fff;
  gap:5px;
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
.live-item .title{
    font-size: .8em;
}
.live-item .uname{
    font-weight: bold;
}
</style>