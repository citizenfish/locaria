const YAML = require('yaml');


module.exports = function (grunt) {
	grunt.initConfig({
		pgsql: {
			tests: {
				options: {
					configFile: '../locus-env.yml',
					configSection: grunt.option('stage') || 'test',
					configType: 'yaml',
					configObjectName: 'postgres'

				},
				tables: [

					//'tests/integration_tests/check_core_tables.sql',
					//'tests/integration_tests/load_test_data.sql',
					//'tests/unit_tests/check_api_functions.sql'
					'tests/unit_tests/search_get_records.sql',


				]
			},
			upgrade: {
				options: {
					configFile: '../locus-env.yml',
					configSection: grunt.option('stage') || 'test',
					configType: 'yaml',
					configObjectName: 'postgres'

				},
				tables: [
					//'configuration/functions/view_creation/views_union.sql',
					//'configuration/functions/view_creation/create_materialised_view.sql',
					//'configuration/schema_and_views/create_categories_table.sql'
					'configuration/functions/search/search_get_records.sql',
					//'configuration/functions/locus_gateway.sql'
					'configuration/functions/search/get_item.sql'
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
					// Session
					'configuration/schema_and_views/create_sessions_table.sql',
					'configuration/functions/sessions_api.sql',

					//Base database configuration
					'configuration/schema_and_views/create_search_schema.sql',
					'configuration/schema_and_views/create_search_categories.sql',
					'configuration/schema_and_views/create_base_search_table.sql',
					'configuration/schema_and_views/create_log_table.sql',
					'configuration/schema_and_views/create_parameters_table.sql',
					'configuration/schema_and_views/create_reports_table.sql',
					'configuration/schema_and_views/create_sessions_table.sql',

					//Create functions before creating views that need them
					'configuration/functions/search_view_union.sql',
					'configuration/functions/locus_gateway.sql',
					'configuration/functions/search.sql',
					'configuration/functions/search_get_records.sql',
					'configuration/functions/cluster.sql',
					'configuration/functions/get_item.sql',
					'configuration/functions/base36_decode.sql',
					'configuration/functions/locate.sql',
					'configuration/functions/get_json_data_urls.sql',
					'configuration/functions/reverse_geocoder.sql',
					'configuration/functions/geocoder.sql',
					'configuration/functions/create_materialised_view.sql',
					'configuration/functions/address_search.sql',
					'configuration/functions/report.sql',
					'configuration/functions/reverse_geocoder.sql',
					'configuration/functions/views_union.sql',
					'configuration/functions/update_json_data_url.sql',
					'configuration/functions/list_categories_with_data.sql',
					'configuration/functions/list_categories.sql',
					'configuration/functions/sessions_api.sql',


					//Reports
					'configuration/reports/category_types.sql',

					//Used by batch processes to load json and update materialized views
					'configuration/system_parameters/system_parameters.sql',

					//Global search view

					'configuration/schema_and_views/create_search_views.sql'
				]
			}
		},
		aws_s3: {
			options: {
				region: grunt.option('region'),
				awsProfile: grunt.option('profile') || 'locus'
			},
			site: {
				options: {
					bucket: grunt.option('bucket'),
					params: {}
				},
				files: [
					{expand: true, cwd: 'site/', src: ['**'], dest: '/'},
					{
						expand: false,
						src: ['site/config/config.gen.js'],
						dest: 'config/config.js'
					},
					{dest: 'config/config.gen.js', 'action': 'delete'}
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



	grunt.registerTask('runTests', ['pgsql:tests']);
	grunt.registerTask('deploySQLFull', ['pgsql:full']);
	grunt.registerTask('deploySQLupgrade', ['pgsql:upgrade']);
	grunt.registerTask('deploySite', ['aws_s3:site','shell:invalidate']);
	grunt.registerTask('apiTest', ['http:version','http:list_categories','http:get_item','http:search','http:bboxsearch']);
};