/**
 * @author Richard Reynolds richard@nautoguide.com
 *
 * @description Database functions
 *
 */

let pg = require("pg");

function Database(client, connectionString, callback) {
    let _this = this;

    _this.client = client;
    _this.connectionString = connectionString;
    _this.callback = callback;
}

Database.prototype.connect = function(after) {
    let _this = this;

    if (!_this.client) {
        _this.client = new pg.Client(_this.connectionString);
        databaseConnect(_this.client, after);
    }
    else {
        _this.client.query('SELECT 1=1', function(err, result) {
            if (err) {
                console.error('Existing client query failure: ', err);

                _this.client.end((err) => {
                    if (err) {
                        console.error('Error while ending the database connection: ', err);
                    }

                    databaseConnect(_this.client, after);
                });
            }
            else {
                console.log('Using existing client connection');
                after();
            }
        });
    }
};

Database.prototype.getClient = function() {
  return this.client;
};

function databaseConnect(client, after) {
    console.log("Connecting to database");
    let self=this;

    client.connect((err) => {
        if (err) {
            console.error("DATABASE CONNECTION FAILURE: ", err.stack);

	        self.callback(null, {
		        statusCode: 220,
		        headers: {
			        "Content-Type": 'application/json',
			        "Access-Control-Allow-Origin": "*",
			        "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,x-token",
			        "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT"
		        },
		        body: JSON.stringify({"error":"Database connection problems"})
	        });
        }
        else {
            console.log("Connected to database");
            after();
        }
    });
}


Database.prototype.constructor = Database;

module.exports = Database;

