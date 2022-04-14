import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: '',
        component: Home
    },
    {
        path: '/video',
        name: '视频',
        component: () =>
            import ( /* webpackChunkName: "video" */ '../views/Fallback.vue')
    }, {
        path: '/feeds',
        name: 'feeds',
        component: () =>
            import ( /* webpackChunkName: "folder" */ '../views/updates/FeedFrame.vue'),
        // component: Folder
        children: [{
            path: '',
            component: () =>
                import ( /* webpackChunkName: "folder" */ '../views/updates/Feed.vue')
        }]
    },
    {
        path: '/folders',
        name: 'folders',
        component: () =>
            import ( /* webpackChunkName: "folder" */ '../views/folders/FolderFrame.vue'),
        // component: Folder
        children: [{
            path: '',
            component: () =>
                import ( /* webpackChunkName: "folder" */ '../views/folders/Main.vue')
        }, {
            path: 'streaming',
            component: () =>
                import ( /* webpackChunkName: "folder" */ '../views/folders/Streaming.vue')
        }, {
            path: ':id',
            component: () =>
                import ( /* webpackChunkName: "folder" */ '../views/folders/Folder.vue')
        }]
    },
    {
        path: '/settings',
        name: '设置',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Fallback.vue')
    }, {
        path: '*',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Fallback.vue')
    }
]

const router = new VueRouter({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router