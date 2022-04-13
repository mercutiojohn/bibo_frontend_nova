<template>
<div class="feed-frame">
    <Sidebar />
    <router-view></router-view>
</div>
</template>

<script>
import Sidebar from './Sidebar.vue'
export default {
name: "",
components: {Sidebar},
data() {
return {

};
},
computed: {},
watch: {},
methods: {},
created(){},
mounted(){},
beforeDestroy(){}
};
</script>

<style>
</style>