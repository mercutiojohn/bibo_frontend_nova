export default {
    methods: {
        getLiveList(pn, ps, start, end, callback) {
            const data = {
                cookies: this.settings.cookies,
                pn: pn,
                ps: ps,
            };
            const options = {
                data: this.qs.stringify(data),
                url: "/live/live_list",
            };
            this.$api(options).then(callback).catch(console.error);
        }
    },
}