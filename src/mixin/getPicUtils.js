export default {
    methods: {
        getBasedPic(url, callback) {
            const data = {
                cover_url: url,
            };
            const options = {
                data: this.qs.stringify(data),
                url: "/cover",
            };
            this.$api(options).then(callback).catch(console.error);
        },
        loadPic(start, end, path, name) {
            try {
                for (let i = start; i < end; i++) {
                    path[i]['based_' + name] = require("@/assets/images/video/bili-fail.png");
                    path[i]['parsed_' + name] = false;
                }
            } catch (error) {
                console.log(`第${start}-${end}张${name}加载失败`);
                setTimeout(() => {
                    for (let i = start; i < end; i++) {
                        this.fetchPic(i, path[i], name);
                    }
                }, 1000);
            }
            setTimeout(() => {
                // console.log(path);
                for (let i = start; i < end; i++) {
                    this.fetchPic(i, path[i], name);
                }
            }, 300)
        },
        loadSubPic(start, end, path, name, sub_name) {
            try {
                for (let i = start; i < end; i++) {
                    path[i][name]['based_' + sub_name] = require("@/assets/images/video/bili-fail.png");
                    path[i][name]['parsed_' + sub_name] = false;
                }
            } catch (error) {
                console.log(error);
                console.log(`第${start}-${end}张${name}加载失败`);
                setTimeout(() => {
                    for (let i = start; i < end; i++) {
                        this.fetchFace(i, path[i][name], name, sub_name);
                    }
                }, 1000);
            }
            setTimeout(() => {
                // console.log(path);
                for (let i = start; i < end; i++) {
                    this.fetchFace(i, path[i][name], name, sub_name);
                }
            }, 300)
        },
        fetchPic(index, path, name) {
            // console.log("<正在>加载第", index, `个${name}`);
            let o_cover_url = path[name];
            if (path['based_' + name] == true) {
                // console.log(path['based_' + name]);
            } else {
                o_cover_url = o_cover_url + "@351w_219h_1c_100q.webp";
                this.getBasedPic(o_cover_url, (res) => {
                    path['based_' + name] =
                        "data:image/png;base64," + res.data;
                    path['parsed_' + name] = true;
                    // console.log("[完成]加载第", index, `个${name}`);
                    // console.log(res.data);
                    this.$nextTick(() => {
                        this.$forceUpdate();
                    });
                });
                // console.log(path['based_' + name]);
            }

        },
        fetchFace(index, path, parent_name, name) {
            console.log("<正在>加载第", index, `个${name}`);
            let o_cover_url = path[name];
            if (path['based_' + name] == true) {
                // console.log(path['based_' + name]);
            } else {
                o_cover_url = o_cover_url + "@351w_219h_1c_100q.webp";
                this.getBasedPic(o_cover_url, (res) => {
                    path['based_' + name] =
                        "data:image/png;base64," + res.data;
                    path['parsed_' + name] = true;
                    console.log("[完成]加载第", index, `个${name}`);
                    // console.log(res.data);
                    this.$nextTick(() => {
                        this.$forceUpdate();
                    });
                });
                // console.log(path['based_' + name]);
            }

        },
        checkIfLoaded(item, type) {
            if (type == "video") {
                return item.based_cover;
            } else if (type == "face") {
                return item.upper.based_face;
            }
        },
    },
}