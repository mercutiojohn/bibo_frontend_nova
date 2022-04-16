// NativeShare
import NativeShare from 'nativeshare'
import Vue from 'vue'

Vue.use(NativeShare)

export default new NativeShare.setShareData({

})
var nativeShare = new NativeShare()
console.log(nativeShare);
var shareData = {
    title: 'NativeShare',
    desc: 'NativeShare是一个整合了各大移动端浏览器调用原生分享的插件',
    // 如果是微信该link的域名必须要在微信后台配置的安全域名之内的。
    link: 'https://github.com/fa-ge/NativeShare',
    icon: 'https://pic3.zhimg.com/v2-080267af84aa0e97c66d5f12e311c3d6_xl.jpg',
    // 不要过于依赖以下两个回调，很多浏览器是不支持的
    success: function() {
        alert('success')
    },
    fail: function() {
        alert('fail')
    }
}

nativeShare.setShareData(shareData)
console.log(nativeShare);

function call(command) {
    try {
        nativeShare.call(command)
    } catch (err) {
        // 如果不支持，你可以在这里做降级处理
        alert(err.message)
    }
}

function setTitle(title) {
    nativeShare.setShareData({
        title: title,
    })
}