<template>
<div class="folder-main">
    <h1>你好，{{userInfo.uname}}</h1>
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