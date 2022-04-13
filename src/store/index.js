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
            cid: '',
            aid: ''
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
        setLoginDialogVisible(state, loginDialogVisible) {
            state.loginDialogVisible = loginDialogVisible;
        },
        logout(state) {
            state.settings.uid = '';
            state.settings.cookies = '';
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
    }
})