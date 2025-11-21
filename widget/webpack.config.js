const path = require('path')
const webpack = require('webpack')

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development'

  return {
    entry: './src/index.ts',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'marquee-widget.js',
      library: {
        name: 'MarqueeNotificationBarWidget',
        type: 'umd',
        export: 'default'
      },
      globalObject: 'this',
      clean: true
    },

    resolve: {
      extensions: ['.ts', '.js', '.css']
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(argv.mode || 'production')
      })
    ],

    devtool: isDevelopment ? 'source-map' : false,

    optimization: {
      minimize: !isDevelopment
    },

    devServer: {
      static: {
        directory: path.join(__dirname, '.')  // Serve from root to access test.html
      },
      compress: true,
      port: 8080,
      hot: true,
      open: ['/test.html']  // Open test.html by default
    },

    // Generate additional builds
    ...(argv.mode === 'production' && {
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: {
          name: 'MarqueeNotificationBarWidget',
          type: 'umd',
          export: 'default'
        },
        globalObject: 'this',
        clean: true
      },
      entry: {
        'marquee-widget': './src/index.ts',
        'marquee-widget.min': './src/index.ts',
        'marquee-widget.esm': './src/index.ts'
      },
      optimization: {
        minimize: true,
        minimizer: [
          (compiler) => {
            const TerserPlugin = require('terser-webpack-plugin')
            new TerserPlugin({
              include: /\.min\.js$/,
              terserOptions: {
                compress: {
                  drop_console: true
                }
              }
            }).apply(compiler)
          }
        ]
      }
    })
  }
}
