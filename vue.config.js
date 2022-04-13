module.exports = {
    pwa: {
        name: '必播',
        themeColor: '#eeeeee',
        msTileColor: '#FFFFFF',
        manifestOptions: {
            background_color: '#eeeeee'
        }
    },
    lintOnSave: false,
    // outputDir: 'dist',
    // publicPath: process.env.NODE_ENV === 'production' ? '/bibo/' : '/',
    publicPath: './',
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = '必播'
                return args
            })
    }
}