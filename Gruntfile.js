const YAML = require('yaml');


module.exports = function (grunt) {
	grunt.initConfig({
		pgsql: {
			tests: {
				options: {
					configFile: '../locaria-env.yml',
					configSection: grunt.option('stage') || 'dev',
					configType: 'yaml',
					configObjectName: 'postgres'

				},
				tables: [
					//** Check schema and add test data **/
					//'tests/integration_tests/core_schema_test.sql',
					//'tests/integration_tests/add_test_data.sql',

					/** SEARCH FUNCTIONS **/
					//'tests/unit_tests/search/address_search_test.sql'
					//'tests/unit_tests/search/cluster_test.sql'
					//'tests/unit_tests/search/get_item_test.sql'
					//'tests/unit_tests/search/list_categories_test.sql'
					//'tests/unit_tests/search/list_categories_with_data.sql'
					'tests/unit_tests/search/list_tags_test.sql'
				]
			},
			upgrade: {
				options: {
					configFile: '../locaria-env.yml',
					configSection: grunt.option('stage') || 'dev',
					configType: 'yaml',
					configObjectName: 'postgres'

				},
				tables: [
					
				]
			},
			full: {
				options: {
					configFile: '../locaria-env.yml',
					configSection: grunt.option('stage') || 'dev',
					configType: 'yaml',
					configObjectName: 'postgres'
				},
				tables: [


					//Create database schema
					'database/schema_and_tables/create_core_schema.sql',
					'database/schema_and_tables/create_categories_table.sql',
					'database/schema_and_tables/create_base_search_table.sql',
					'database/schema_and_tables/create_containers_table.sql',
					'database/schema_and_tables/create_groups_table.sql',
					'database/schema_and_tables/create_history_table.sql',
					'database/schema_and_tables/create_log_table.sql',
					'database/schema_and_tables/create_moderation_queue_table.sql',
					'database/schema_and_tables/create_parameters_table.sql',
					'database/schema_and_tables/create_reports_table.sql',
					'database/schema_and_tables/create_sessions_table.sql',


					//Create functions before creating views that need them
					'database/functions/utility/*',
					'database/functions/internal/*',
					'database/functions/reports/*',
					'database/functions/search/*',
					'database/functions/sessions/*',
					'database/functions/view_creation/*',
					'database/functions/locaria_gateway.sql',
					'database/functions/locaria_internal_gateway.sql',

					//Reports
					'database/reports/*',

					//System Parameters
					'database/system_parameters/*',

					//Final step Create the global search view

					'database/schema_and_tables/create_search_views.sql'
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
					{expand: true, cwd: 'site/', src: ['**'], dest: '/' + grunt.option('path')}
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