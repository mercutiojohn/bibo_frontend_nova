<template>
<div class="folder-main">
    <h1>你好，{{userInfo.uname}}</h1>
    <h2>从离开的视频继续...</h2>
    <div></div>
    <h2>之前搁置的视频</h2>
    <div></div>
    <h2>正在直播的UP主</h2>
    <div></div>
    <h2>最新收藏的内容</h2>
    <div></div>
</div>
</template>

<script>
export default {
name: "Main",
components: {},
data() {
return {

};
},
computed: {
    settings: function () {
      return this.$store.getters.getSettings;
    },
    userInfo(){
      return this.$store.getters.getUserInfo;
    }
},
watch: {},
methods: {},
created(){},
mounted(){},
beforeDestroy(){}
};
</script>

<style scoped>
.folder-main{
    padding:30px;
}
</style>