const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		full:'./src/locus/index.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'site/dist')
	}
};