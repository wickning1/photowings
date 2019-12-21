const webpack = require('webpack')
const config = require('sapper/config/webpack.js')
const pkg = require('./package.json')

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const dev = mode === 'development'

const extensions = ['.mjs', '.js', '.json', '.svelte', '.html']
const mainFields = ['svelte', 'module', 'browser', 'main']

module.exports = {
  client: {
    entry: config.client.entry(),
    output: config.client.output(),
    resolve: { extensions, mainFields },
    module: {
      rules: [
        {
          test: /\.(js|svelte)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  useBuiltIns: 'usage',
                  corejs: { version: 3 },
                  targets: {
                    node: 'current',
                    edge: 40
                  }
                }]
              ],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-transform-spread',
                '@babel/plugin-proposal-object-rest-spread'
              ]
            }
          }
        },
        {
          test: /\.svelte$/,
          use: [
            {
              loader: 'svelte-loader',
              options: {
                dev,
                hydratable: true,
                hotReload: false // pending https://github.com/sveltejs/svelte/issues/2377
              }
            }
          ]
        }
      ]
    },
    mode,
    plugins: [
      // pending https://github.com/sveltejs/svelte/issues/2377
      // dev && new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode)
      })
    ].filter(Boolean),
    devtool: dev && 'inline-source-map'
  },

  server: {
    entry: config.server.entry(),
    output: config.server.output(),
    target: 'node',
    resolve: { extensions, mainFields },
    externals: [...Object.keys(pkg.dependencies), 'encoding'],
    module: {
      rules: [
        {
          test: /\.(svelte)$/,
          use: {
            loader: 'svelte-loader',
            options: {
              css: false,
              generate: 'ssr',
              dev
            }
          }
        }
      ]
    },
    mode,
    performance: {
      hints: false // it doesn't matter if server.js is large
    },
    plugins: []
  },
  serviceworker: {
    entry: config.serviceworker.entry(),
    output: config.serviceworker.output(),
    mode: mode
  }
}
