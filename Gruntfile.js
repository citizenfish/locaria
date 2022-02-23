
module.exports = function (grunt) {
	grunt.initConfig({
		aws_s3: {
			options: {
				region: grunt.option('region'),
				awsProfile: grunt.option('profile') || 'locaria'
			},
			site: {
				options: {
					bucket: grunt.option('bucket'),
					params: {}
				},
				files: [
					{expand: true, cwd: 'site/', src: ['**'], dest: '/' + grunt.option('theme')}
				]
			}
		},

		http: {
			version: {
				options: {
					url: grunt.option('url') + '/version',
					method: 'POST',
					json: true,
					body: {}
				},
				dest: 'api_response.json'
			},
			list_categories: {
				options: {
					url: grunt.option('url') + '/list_categories',
					method: 'POST',
					json: true,
					body: {}
				},
				dest: 'api_response.json'
			},
			get_item: {
				options: {
					url: grunt.option('url') + '/get_item',
					method: 'POST',
					json: true,
					body: {}
				},
				dest: 'api_response.json'
			},
			search: {
				options: {
					url: grunt.option('url') + '/search',
					method: 'POST',
					json: true,
					body: {"category": "*", "search_text": "Frimley"}
				},
				dest: 'api_response.json'
			},
			bboxsearch: {
				options: {
					url: grunt.option('url') + '/search',
					method: 'POST',
					json: true,
					body: {"bbox": "-0.8 51.3,-0.7 51.4", "category": "*", "search_text": "Frimley"}
				},
				dest: 'api_response.json'
			}


		},
		shell: {
			options: {
				stderr: false
			},
			invalidate: {
				command: 'aws cloudfront create-invalidation --distribution-id=' + grunt.option('distribution') + ' --paths "/*" --profile ' + grunt.option('profile')
			}
		},
	});

	grunt.loadNpmTasks('@nautoguide/grunt-pgsql');
	grunt.loadNpmTasks('grunt-aws-s3');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-http');


	grunt.registerTask('runTests', ['pgsql:tests']);
	grunt.registerTask('deploySQLFull', ['pgsql:full']);
	grunt.registerTask('deploySQLupgrade', ['pgsql:upgrade']);
	grunt.registerTask('deploySite', ['aws_s3:site', 'shell:invalidate']);
	grunt.registerTask('apiTest', ['http:version', 'http:list_categories', 'http:get_item', 'http:search', 'http:bboxsearch']);
};