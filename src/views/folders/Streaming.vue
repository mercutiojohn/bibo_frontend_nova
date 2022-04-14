<template>
<div class="streaming">
    正在直播
    <div class="live-list">
        {{liveList}}
    </div>
</div>
</template>

<script>
export default {
name: "Streaming",
components: {},
data() {
return {
    liveList:[]
};
},
computed: {},
watch: {},
methods: {
    getLiveList(){
        
    }
},
created(){},
mounted(){},
beforeDestroy(){}
};
</script>

<style>
</style>