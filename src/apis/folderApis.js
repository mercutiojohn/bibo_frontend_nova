export default {
    methods: {

        getInfos(ids, callback) {
            const data = {
                ids: ids,
                cookies: this.settings.cookies,
            };
            const options = {
                data: this.qs.stringify(data),
                url: "/favourites/infos_list",
            };
            this.$api(options).then(callback);
        },
    }
}