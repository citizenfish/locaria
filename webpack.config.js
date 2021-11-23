const path = require('path');
const theme = 'nmrn';

module.exports = {
	mode: 'development',
	entry: {
		full: './src/locus/index.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'site/dist'),
		assetModuleFilename: 'other/[hash][ext][query]'
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
				exclude: /node_modules/,
				use: ['babel-loader']
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
			libs: path.resolve(__dirname, 'src/locus/libs'),
			themeLocus: path.resolve(`./src/theme/${theme}/locus.js`),
			themeDefault: path.resolve(`./src/theme/default`),
			mapStyle: [
				path.resolve(`src/theme/${theme}/view.js`),
				path.resolve(`src/locus/components/mapStyles/view.js`)
			],
			home: [
				path.resolve(`src/theme/${theme}/components/home.js`),
				path.resolve(`src/locus/components/home.js`)
			]

		}
	},
	devServer: {
		contentBase: path.join(__dirname, 'site'),
		compress: true,
		port: 8080,
		historyApiFallback: {
			index: 'index.html'
		},
		liveReload: false,
		hot: true
	}
};