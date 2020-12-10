/**
 *  richard@nautoguide.com
 *
 *  Lambda JSON Scraper
 */

'use strict';
const pg = require("pg");
const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports.run = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	let client = new pg.Client(process.env.postgres);
	let stack=[];
	let rowStack=[];
	let sqlStack=[];
	let row;
	let currentTable;
	let totals=0;

	/**
	 *  Connect to database and if successful acquire the URLS we need to process
	 */
	client.connect((err) => {
		if(err) {
			console.log(`Database connect error: ${err}`);
			context.fail();
		} else {
			const querysql = "SELECT (locus_core.get_json_data_urls()).*";
			runSQL(querysql,[],processURLSetup,generalFail);
		}
	});

	/**
	 * Setup our process stack with the URL's we got
	 * @param result
	 */
	function processURLSetup(result) {
		stack=[result[0].attributes];
		currentTable=result[0]['table_name'];
		console.log(`Found ${stack.length} URLS to process`);
		processURL();
	}

	/**
	 *  Process each URL in order RECURSIVE
	 */
	function processURL() {
		if(stack.length===0) {
			console.log('All Work Done, doing view refresh');
			getParam('view_refresh',viewSuccess,generalFail);
		} else {
			row = stack.pop();
			console.log(`Processing ${row.uri} with ${row.sql} `);

			switch(row.source) {
				case 'application/json':
					uri_http();
					break;
				case 'application/sql':
					runSQL(row.uri,[],uri_sql,generalFail);
					break;
				default:
					console.log(`Unknown source ${row.source}`);
					let querysql="SELECT locus_core.update_json_data_urls($1, $2::JSON)";
					let args=[currentTable,row];
					runSQL(querysql,args,processURL,generalFail);
					break;
			}

		}
	}

	function uri_sql(result) {
		//console.log(result);
		sqlStack=result;
		rowStack=[];
		totals=sqlStack.length;
		fetchStack();
	}

	function fetchStack() {
		if(sqlStack.length===0) {
			totals=rowStack.length;
			addRow();
		} else {
			let tmp=sqlStack.pop();
			const settings = { method: "Get" };

			fetch(tmp.linkuri, settings)
				.then(res => res.text())
				.then((res) => {
					const $ = cheerio.load(res);

					let tmpJson={};
					tmpJson.id=tmp.id;
					for(let i in row.selectors) {
						if(row.selectors[i].attr!==undefined)
							tmpJson[row.selectors[i].name]=$(row.selectors[i].selector).attr(row.selectors[i].attr);
						else
							tmpJson[row.selectors[i].name]=$(row.selectors[i].selector).text();
						tmpJson[row.selectors[i].name]=tmpJson[row.selectors[i].name].replace(/\n|\t|\s\s/gm,'');
						if(row.selectors[i].regex!==undefined) {
							let re = new RegExp(row.selectors[i].regex);
							tmpJson[row.selectors[i].name] = tmpJson[row.selectors[i].name].replace(re, '');
						}
						if(row.selectors[i].prepend!==undefined) {
							tmpJson[row.selectors[i].name]=row.selectors[i].prepend+tmpJson[row.selectors[i].name];
						}
					}
					rowStack.push(tmpJson);
					fetchStack();

				})
				.catch( function(err) {
					console.log(err);
					fetchStack();
				});
		}
	}

	function uri_http() {
		const settings = { method: "Get" };
		/**
		 *  Get the json from the specified URL
		 */
		fetch(row.uri, settings)
			.then(res => res.json())
			.then((json) => {
				if(row.json_key!=='')
					rowStack=json[row.json_key];
				else
					rowStack=json;

				console.log(`Got [${Object.keys(rowStack).length}] records...Processing`);
				totals=Object.keys(rowStack).length;
				addRow();
			})
			.catch( function(err) {
				console.log(err);
				let querysql="SELECT locus_core.update_json_data_urls($1, $2::JSON)";
				let args=[currentTable,row];
				runSQL(querysql,args,processURL,generalFail);
			});
	}

	/**
	 *  Step one get view SQL to use from params
	 * @param result
	 */
	function viewSuccess(result) {
		runSQL(result.parameter.sql,[],viewRebuild,generalFail);
	}

	/**
	 *  Run the view sql we got above
	 * @param result
	 */
	function viewRebuild(result) {
		runSQL("INSERT INTO locus_core.logs(log_type, log_message) VALUES ('scraper', $1::JSONB)",[{"results":{"totalRows":totals,"table":currentTable}}],
			function(){
				console.log('Done');
				context.succeed();
				},generalFailExit);

	}

	/**
	 *  Generic SQL fail function
	 * @param err
	 */

	function generalFail(err) {
		console.log(`Database error: ${err.stack}`);
		runSQL("INSERT INTO locus_core.logs(log_type, log_message) VALUES ('scraper', $1::JSONB)",[{"error":err.stack}],generalFailExit,generalFailExit);
	}

	function generalFailExit() {
		context.fail();
	}

	/**
	 *  Add a JSON row to the database RECURSIVE
	 */
	function addRow() {
		if(rowStack.length==0) {
			console.log('All JSON Processed - Updating time stamps');
			let querysql="SELECT locus_core.update_json_data_urls($1, $2::JSON)";
			let args=[currentTable,row];
			runSQL(querysql,args,processURL,generalFail);

		} else {
			let querysql = row.sql.replace(/\\\'/,"'");
			let args=rowStack.pop();
			runSQL(querysql,[args],addRow,addFail);
		}
	}

	/**
	 * Add row fail, log out error but continue
	 * @param err
	 */
	function addFail(err) {
		console.log(`Database error: ${JSON.stringify(err)}`);
		runSQL("INSERT INTO locus_core.logs(log_type, log_message) VALUES ('scraper', $1::JSONB)",[{"error":err.stack}],addRow,addRow);
	}


	/**
	 * Get a param from the parameters table
	 * @param name
	 * @param success
	 * @param fail
	 */
	function getParam(name,success,fail) {
		let querysql = "SELECT parameter FROM locus_core.parameters WHERE parameter_name = $1";
		let qarguments = [name];
		client.query(querysql, qarguments, function (err, result) {
			if (err) {
				fail(err);
			} else {
				success(result.rows[0]);
			}
		});
	}

	/**
	 * Run a pure SQL
	 * @param sql
	 * @param args
	 * @param success
	 * @param fail
	 */
	function runSQL(sql,args,success,fail) {
		client.query(sql, args, function (err, result) {
			if (err) {
				fail(err);
			} else {
				success(result.rows);
			}
		});
	}

};