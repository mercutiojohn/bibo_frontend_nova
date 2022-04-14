import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        settings: {
            cookies: "",
            uid: '',
        },
        logined: false,
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
        },
        play(state, obj) {
            console.log('store', obj.aid, obj.page);
            state.player.playing = false;
            state.player.useBvid = obj.useBvid;
            state.player.usePage = obj.usePage;
            state.player.aid = obj.aid;
            state.player.bvid = obj.bvid;
            state.player.cid = obj.cid;
            state.player.page = obj.page;
            state.player.info = obj.info;
            state.player.playing = true;
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
        getPlayer: (state) => {
            // if (localStorage.getItem("settings")) {
            //     state.settings = JSON.parse(decodeURIComponent(localStorage.getItem('settings')));
            // }
            return state.player;
        },
    }
})