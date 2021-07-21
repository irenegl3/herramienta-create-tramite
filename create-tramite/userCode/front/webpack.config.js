const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path');
const path = require('path');
require('dotenv').config()
const DotenvWebpack = require('dotenv-webpack');
const tramite = process.env.TRAMITE || 'gestionTitulos';
const enumTramites = require('../back/enums').tramites;

module.exports = env => {
    let build = '/back/public/js'
    const filename = `bundle_${env.type}.js`
    if (env.production) {
        build += '/' + tramite;
    }
    let port = 4000;
    if (env.type == 'estudiantes') {
        port = 4001;
    }
    return {
        entry: `./${env.type}/main.js`,
        output: {
            //ruta absoluta
            path: path.join(__dirname, '..',build),
            filename: filename
        },

        context: resolve(__dirname, 'app'),

        devServer: {
            port: port,
            contentBase: `${__dirname}/app/${env.type}/`,
            hot: true
        },
        //lo que queramos que traduzca de los imports que se encuentre en los javascripts
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [
                        { loader: 'style-loader' },
                        { loader: 'css-loader' }
                    ]

                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.(scss|sass)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        'style-loader',
                        'css-loader',
                        { loader: 'sass-loader', options: { sourceMap: true } },
                    ],
                },
            ]
        },

        resolve: {
            // resuelve extensiones al no indicarlas los import
            extensions: ['.js', '.jsx', '.es6'],
        },

        plugins: [
            //env from webpack to the web app
            new DotenvWebpack(),
        ],
    }


}