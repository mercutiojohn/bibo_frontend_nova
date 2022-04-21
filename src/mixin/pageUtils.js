export default {
    data() {
        return {
            pageSize: 8,
            pageNumber: 1,
            empty: false,
            subLoading: false,
            loading: true,
            count: 0,
        }
    },
    methods: {
        getLoadPage(call) {
            let page = this.pageNumber;
            const length = this.count;
            console.log(length);
            const pageSize = this.pageSize;
            let start = (page - 1) * pageSize;
            let end = (page - 1) * pageSize + pageSize;
            if (start == length) {
                this.empty = true;
                // this.subLoading = false;
                return null;
            } else if (start > length) {
                // this.subLoading = false;
                return null;
            }
            this.subLoading = true;
            console.log(end, ">", length, end > length);
            if (end > length) {
                console.log("end changed from", end, "to", length);
                end = length;
            }
            console.log(
                "当前页码：",
                page,
                "每页个数：",
                pageSize,
                "index：",
                start,
                "-",
                end
            );
            call(page, pageSize, start, end);
            //   this.loading = false;
            this.pageNumber++;
        },
        getLoad(url, callback) {
            const data = {
                cookies: this.settings.cookies,
                pn: this.pageNumber,
                ps: this.pageSize,
            };
            const options = {
                data: this.qs.stringify(data),
                url: url,
            };
            this.$api(options).then(callback);
        },
    }
}