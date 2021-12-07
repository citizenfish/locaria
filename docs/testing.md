# Overview

LOCUS can be tested using a series of SQL scripts to ensure that the system is properly configured and working.

These are located within the directory tests

- integration_tests are used to check that LOCUS has been installed correctly
- unit_tests check that the core fundtional components of LOCUS are working as expected

Tests are run using the  "tests" command from the LOCUS configure script

The tests to be run should be located in the files section of the pgsql:tests object in Gruntfile.js

In the example below the test **check_api_functions.sql** will be run

```js
pgsql: {
    tests: {
        options: {
            configFile: '../locaria-env.yml',
            configSection: grunt.option('stage') || 'test',
            configType: 'yaml',
            configObjectName: 'postgres'

        },
        tables: [

            //'tests/integration_tests/check_core_tables.sql',
            //'tests/integration_tests/load_test_data.sql',
            'tests/unit_tests/check_api_functions.sql'

        ]
    }
```
