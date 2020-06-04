const YAML = require('yaml');


module.exports = function (grunt) {
	grunt.initConfig({
		pgsql: {
			upgrade: {
				options: {
					configFile: '../locus-env.yml',
					configSection: grunt.option('stage') || 'test',
					configType: 'yaml',
					configObjectName: 'postgres'

				},
				tables: [

					'configuration/schema_and_views/create_reports_table.sql',
					'configuration/functions/report.sql',
					'configuration/functions/locus_gateway.sql',
					'tests/unit_tests/test_report.sql'

				]
			},
			full: {
				options: {
					configFile: '../locus-env.yml',
					configSection: grunt.option('stage') || 'test',
					configType: 'yaml',
					configObjectName: 'postgres'
				},
				tables: [
					//Base database configuration
					'configuration/schema_and_views/create_search_schema.sql',
					'configuration/schema_and_views/create_search_categories.sql',
					'configuration/schema_and_views/create_base_search_table.sql',
					'configuration/schema_and_views/create_log_table.sql',
					'configuration/schema_and_views/create_parameters_table.sql',

					//Create functions before creating views that need them
					'configuration/functions/search_view_union.sql',
					'configuration/functions/locus_gateway.sql',
					'configuration/functions/search.sql',
					'configuration/functions/get_item.sql',
					'configuration/functions/opennames_postcode_geocoder.sql',
					'configuration/functions/base36_decode.sql',
					'configuration/functions/locate.sql',
					'configuration/functions/get_json_data_urls.sql',

					'configuration/schema_and_views/create_search_views.sql',
					//Create SH data views then refresh the materialized view
					'configuration/data_loading/create_surrey_heath_test_views.sql',

					//Used by batch processes to load json and update materialized views
					'configuration/data_loading/json_apis/create_surrey_heath_json_data_sources.sql',
					'configuration/system_parameters/system_parameters.sql'
				]
			}
		},
		aws_s3: {
			options: {
				region: 'eu-west-1',
				awsProfile: grunt.option('profile') || 'locus'
			},
			site: {
				options: {
					bucket: 'locus-hosting',
					params: {}
				},
				files: [
					{expand: true, cwd: 'site/', src: ['**'], dest: 'site/'},
					{
						expand: false,
						src: ['site/config/config-test.js'],
						dest: 'site/config/config.js'
					},
					{dest: 'sites/config/config.gen.js', 'action': 'delete'}
				]
			}
		},
		template: {
			buildConfig: {
				options: {
					data: {}
				},
				files: {
					'site/config/config.gen.js': ['site/config/config.tpl.js']
				}
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
					body: { "category":"*", "search_text":"Frimley" }
				},
				dest: 'api_response.json'
			},
			bboxsearch: {
				options: {
					url: grunt.option('url') + '/search',
					method: 'POST',
					json: true,
					body: { "bbox": "-0.8 51.3,-0.7 51.4", "category":"*", "search_text":"Frimley" }
				},
				dest: 'api_response.json'
			}


		},
		shell: {
			options: {
				stderr: false
			},
			invalidate: {
				command: 'aws cloudfront create-invalidation --distribution-id='+grunt.option('distribution')+' --paths "/*" --profile '+grunt.option('profile')
			}
		},
	});

	grunt.loadNpmTasks('@nautoguide/grunt-pgsql');
	grunt.loadNpmTasks('grunt-aws-s3');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-http');
	grunt.loadNpmTasks('grunt-template');

	/**
	 *  Custom task to load yml file and set up or template processor
	 */
	grunt.registerTask('loadyaml', 'Load S3 file url.', function() {
		let fileData = YAML.parse(grunt.file.read('../locus-custom.yml'));
		let stage=grunt.option('stage');
		grunt.config(['template','buildConfig','options','data'],fileData[stage]);
		console.log(fileData[stage]);
		grunt.log.write("Yaml Loaded").ok();

	});


	grunt.registerTask('deploySQLFull', ['pgsql:full']);
	grunt.registerTask('deploySQLupgrade', ['pgsql:upgrade']);
	grunt.registerTask('deploySite', ['loadyaml','template:buildConfig','aws_s3:site','shell:invalidate']);
	grunt.registerTask('apiTest', ['http:version','http:list_categories','http:get_item','http:search','http:bboxsearch']);
};