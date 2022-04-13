<template>
<div class="folder-main">
    <h1>Hi,{{settings.uid}}</h1>
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