export default {
    methods: {
        getHistoryList(pn, ps, callback) {
            const data = {
                cookies: this.settings.cookies,
                pn: pn,
                ps: ps,
            };
            const options = {
                data: this.qs.stringify(data),
                url: "/history/history_info",
            };
            this.$api(options).then(callback);
        },
    },
}