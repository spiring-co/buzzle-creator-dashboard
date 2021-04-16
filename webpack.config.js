module.exports = {
    module: {
        rules: [
            { test: /\.css$/, loader: 'css-loader' },
            { test: /\.svg$/, loader: 'file-loader' }
        ]
    }, plugins: [
        new webpack.DefinePlugin({
            'process.browser': 'true'
        }),
    ]
};