const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		full:'./src/locus/index.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'site/dist')
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.(woff|woff2|eot|ttf)(\?.*$|$)/i,
				use: [
					'file-loader',
				],
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
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						}
					}
				]
			}
		]
	},
	resolve: {
		fallback: {
			util: require.resolve('util/'),
			"../../theme.config$": path.join(__dirname, "./src/semantic-ui/theme.config"),
			"../semantic-ui/site": path.join(__dirname, "/semantic-ui/site")

		}
	}
};