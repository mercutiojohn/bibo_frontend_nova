export default {
    methods: {
        getDate(datestring) {
            return new Date(datestring * 1000).toLocaleString();
        },
        getTime(timestring) {
            let h = new Date(timestring * 1000).getUTCHours();
            let m = new Date(timestring * 1000).getMinutes();
            let s = new Date(timestring * 1000).getSeconds();
            m = this.checkTime(m);
            s = this.checkTime(s);
            return (h != 0 ? h + ":" : "") + m + ":" + s;
        },
        parseNumber(num) {
            if (num > 10000) {
                return (num / 10000).toFixed(2) + "万";
            } else {
                return num;
            }
        },
        checkTime(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        },
        briefParseReturn(text) {
            return text.replace(/[\n]/g, "<br/>");
        },
        deepCopy(obj) {
            var objCopy = {};
            for (var key in obj) {
                objCopy[key] = obj[key];
            }
            return objCopy;
        },
    }
}