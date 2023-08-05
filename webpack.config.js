const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MONACO_DIR = path.join(__dirname, "node_modules/monaco-editor");

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: './[contenthash].[name].bundle.js',
        clean: true
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            noEmit: false
                        },
                    }
                }
            },
            {
                test: /\.css$/,
                include: MONACO_DIR,
                use: ["style-loader", {
                    "loader": "css-loader",
                    "options": {
                        "url": false,
                    },
                }],
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src'),
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'images/[name].[ext]',
                        },
                    },
                ],
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            favicon: "./public/favicon.png"
        }),
    ],
    devServer: {
        historyApiFallback: true,
        static: path.join(__dirname, 'public'), // Изменено с contentBase на static
        port: 3000,
        hot: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3145',
            }
        }
    },
};
