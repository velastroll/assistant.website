module.exports = {
    publicPath: '/',
    devServer: {
        proxy: 'http://localhost:8083/',
        port: 8083
    }
}