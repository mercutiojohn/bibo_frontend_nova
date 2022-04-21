export default {
    methods: {
        share(title, link, desc, icon, from) {
            this.$share.setShareData({
                icon: icon,
                link: link,
                title: title,
                desc: desc,
                from: from,
            });
            try {
                this.$share.call();
                // 如果是分享到微信则需要 nativeShare.call('wechatFriend')
                // 类似的命令下面有介绍
            } catch (err) {
                // 如果不支持，你可以在这里做降级处理
                console.log(err);
            }
        },
    }
}