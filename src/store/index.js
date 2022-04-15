import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        settings: {
            cookies: "",
            uid: '',
        },
        userInfo: {
            uname: ''
        },
        // logined: false,
        loginDialogVisible: false,
        player: {
            playing: false,
            cid: '',
            aid: '',
            bvid: '',
            useBvid: false,
            info: {
                pages: []
            }
        },
        playerLive: {
            playing: false,
            roomid: '',
            uid: '',
            info: {

            }
        }
    },
    mutations: {
        update(state, [key, value]) {
            state[key] = value;
            // console.log(key)
        },
        setSettings(state, settings) {
            localStorage.setItem('settings', encodeURIComponent(JSON.stringify(settings)));
            state.settings = settings;
        },
        // setPlayer(state, player) {
        //     // localStorage.setItem('player', encodeURIComponent(JSON.stringify(player)));
        //     state.player = player;
        // },
        setLoginDialogVisible(state, loginDialogVisible) {
            state.loginDialogVisible = loginDialogVisible;
        },
        logout(state) {
            state.settings.uid = '';
            state.settings.cookies = '';
            state.userInfo = {};
        },
        login(state, obj) {
            state.settings.uid = obj.uid;
            state.settings.cookies = obj.cookies;
        },
        play(state, obj) {
            console.log('store', obj.aid, obj.page);
            state.player.playing = false;
            state.playerLive.playing = false;
            state.player.useBvid = obj.useBvid;
            state.player.usePage = obj.usePage;
            state.player.aid = obj.aid;
            state.player.bvid = obj.bvid;
            state.player.cid = obj.cid;
            state.player.page = obj.page;
            state.player.info = obj.info;
            state.player.playing = true;
        },
        playLive(state, obj) {
            console.log('store', obj.uid, obj.roomid);
            state.player.playing = false;
            state.playerLive.playing = false;
            state.playerLive.uid = obj.uid;
            state.playerLive.roomid = obj.roomid;
            state.playerLive.info = obj.info;
            state.playerLive.playing = true;
        },
        setUserInfo(state, obj) {
            console.log(obj);
            state.userInfo = obj;
        },
        stopPlayer(state) {
            state.player.playing = false;
            state.playerLive.playing = false;
            state.player.aid = '';
            state.player.bvid = '';
            state.player.cid = '';
            state.player.page = '';
            state.player.info = '';
            state.playerLive.uid = '';
            state.playerLive.roomid = '';
            state.playerLive.info = '';
        }
    },
    actions: {},
    modules: {},
    getters: {
        getSettings: (state) => {
            if (localStorage.getItem("settings")) {
                state.settings = JSON.parse(decodeURIComponent(localStorage.getItem('settings')));
            }
            return state.settings;
        },
        getUserInfo: (state) => {
            return state.userInfo;
        },
        getPlayer: (state) => {
            // if (localStorage.getItem("settings")) {
            //     state.settings = JSON.parse(decodeURIComponent(localStorage.getItem('settings')));
            // }
            return state.player;
        },
        getPlayerLive: (state) => {
            // if (localStorage.getItem("settings")) {
            //     state.settings = JSON.parse(decodeURIComponent(localStorage.getItem('settings')));
            // }
            return state.playerLive;
        },
        checkLogin: (state) => {
            if (state.settings.uid === '' || state.cookies === '') {
                return false;
            } else {
                return true;
            }
        },
    }
})