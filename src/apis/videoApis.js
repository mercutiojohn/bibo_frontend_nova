export default {
    methods: {
        getVideoPages(aid, callback) {
            const data = {
                aid: aid,
                cookies: this.settings.cookies,
            };
            const options = {
                data: this.qs.stringify(data),
                url: "/video/pages_list",
            };
            this.$api(options).then(callback).catch(console.error);
        },
        getTags(aid, callback) {
            const data = {
                aid: aid,
                cookies: this.settings.cookies,
            };
            const options = {
                data: this.qs.stringify(data),
                url: "/video/tags_list",
            };
            this.$api(options).then(callback).catch(console.error);
        },
    }
}