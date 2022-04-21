export default {
    methods: {
        play(aid, bvid, cid, page, info) {
            const obj = {
                aid: aid,
                bvid: bvid,
                useBvid: false,
                usePage: true,
                page: page,
                cid: cid,
                info: info,
            };
            console.log(page, obj);
            this.$store.commit("play", obj);
            this.$bus.$emit("reloadVideo", "video");
        }
    }
}