const path = require('path');
const theme = 'src/theme/builder';

module.exports = {
	mode: 'development',
	entry: {
		full: './src/locaria/index.js',
		admin: './src/locaria/adminIndex.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'site/dist'),
		assetModuleFilename: 'other/[hash][ext][query]',
	},
	module: {
		rules: [
			{
				test: /\.(svg|png|jpg)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'images/[hash][ext][query]'
				}
			},
			{
				test: /\.(ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[hash][ext][query]'
				}
			},
			{
				test: /\.(js)$/,
				//exclude: /node_modules/,
				use: ["source-map-loader",'babel-loader']
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'less-loader',
						options: {
							lessOptions: {
								sourceMap: true
							},
						},
					},
				],
			}
		]
	},
	resolve: {
		fallback: {
			util: require.resolve('util/')
		},
		alias: {
			libs: path.resolve(__dirname, 'src/locaria/libs'),
			widgets: [
				path.resolve(`${theme}/components/widgets`),
				path.resolve(`src/locaria/components/widgets`)
			],
			themeLocaria: path.resolve(`${theme}/locaria.js`),
			stylesLocaria: path.resolve(`${theme}/styles.js`),
			themeDefault: path.resolve(`src/theme/default`),
			mapStyle: [
				path.resolve(`${theme}/view.js`),
				path.resolve(`src/locaria/components/mapStyles/view.js`)
			],
			components: [
				path.resolve(`${theme}/components`),
				path.resolve(`src/locaria/components`)
			],
			theme: [
				path.resolve(__dirname, `${theme}`)
			]

		}
	},
	devServer: {
		contentBase: path.join(__dirname, 'site'),
		compress: true,
		port: 80,
		historyApiFallback: {
			index: 'index.html',
			rewrites: [
					{ from: /^\/Admin\//, to: '/admin.html' }
				]
		},
		liveReload: false,
		hot: false
	}
};