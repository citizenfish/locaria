
const {S3Client, ListObjectsCommand, PutObjectCommand, GetObjectCommand} = require("@aws-sdk/client-s3");
const {Client} = require("pg");
const loadUtils = require('./load_modules');
const planitURL = 'https://www.planit.org.uk/api';

let configs = process.env;

module.exports.loadPlanningData = async (params) => {


    if (params) {

        configs = params;
        configs['schema'] = configs.schema === undefined ? 'locus_data' : configs.schema;

        //set AWS environment variables when parameters passed in
        process.env['AWS_ACCESS_KEY_ID'] = configs.AWS_ACCESS_KEY_ID;
        process.env['AWS_SECRET_ACCESS_KEY'] = configs.AWS_SECRET_ACCESS_KEY;

    }

    if(!configs.centroid) {
        global.result.status = 'Local authority centroid required to download data';
        return {'error' : 'Local authority centroid required to download data'}
    }


    //Database connection
    const client = new Client({
        user: configs.auroraMasterUser,
        host: configs.auroraHost,
        database: configs.auroraDatabaseName,
        password: configs.auroraMasterPass,
        port: configs.auroraPort,
    });

    //await client.connect().catch(e => console.log(e.stack));

    //Check/create planning table in database

    let response = await loadUtils.run_sql_from_file('./planning_table.sql', client);

    //console.log(response);

    //Retrieve area for location provided

    let area = await loadUtils.fetch_sync(`${planitURL}/areas/json?&lat=${configs.centroid.lat}&lng=${configs.centroid.lon}&krad=0.01&select=area_id,area_name,area_type,gss_code,has_planning`)

    console.log(area);

    //Retrieve applications for area name

    //Load applications into database

    //Refresh search view


}