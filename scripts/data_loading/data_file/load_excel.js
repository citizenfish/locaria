const {runQuery, gets3File} = require('../load_utils')
const XLSX = require('xlsx');
const utils = require("../load_utils.js");

module.exports.load_excel = async (command, us) => {

    let jsonData = []
    if (!command.parameters.file_path) {
        throw {error: 'Missing Excel file'}
    }

    //read file from S3
    const file_contents = await gets3File(command.region, command.bucket, command.parameters.file_path, false)


    //Convert into JSON format
    let workbook = XLSX.read(file_contents, {type: "buffer"});
    for (let s in workbook.SheetNames) {
        us({message: `Loading worksheet ${workbook.SheetNames[s]}`});


        let sheet_json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[s]]);

        sheet_json.map(function (row) {
            row._xls_sheet_name = workbook.SheetNames[s];
            return row;
        });

        if (workbook.SheetNames[s] === command.parameters.sheet_name) {

            jsonData = jsonData.concat(sheet_json);
        }
    }

    //Map data and load
    let count = 0

    //Clear data if required
    if (command.parameters.truncate) {
        us({message: `TRUNCATE ${command.parameters.excel_table}`})
        let query = `TRUNCATE ${command.parameters.excel_table}`
        command['query'] = query
        await runQuery(command)
    }

    for (let j in jsonData) {

        try {
            //A mask allows you to format your Excel data into the required LOCUS structure on load
            let mask = JSON.stringify(command.parameters.mapping)

            for (let k in jsonData[j]) {

                //substitute into mask and escape newlines and tabs etc..

                let rgx = new RegExp(`__${k}__`, 'gm')
                let replaceString =   jsonData[j][k].replace(/[\"]/g, '\\"')
                                                    .replace(/[\\]/g, '\\\\')
                                                    .replace(/[\/]/g, '\\/')
                                                    .replace(/[\b]/g, '\\b')
                                                    .replace(/[\f]/g, '\\f')
                                                    .replace(/[\n]/g, '\\n')
                                                    .replace(/[\r]/g, '\\r')
                                                    .replace(/[\t]/g, '\\t')
                //mask = mask.replace(rgx, String(jsonData[j][k]).replace(/(\r\n|\n|\r|['"]|\t)/gm, ''), 'g')
                mask = mask.replace(rgx, replaceString)
                //Add in a record count variable if required
                mask = mask.replace('@INC@', count)

            }
            count++

            //either load just the mask or everything  plus the mask

            if(command.parameters.non_mask){
                jsonData[j] = {...jsonData[j], ...JSON.parse(mask)}
            } else{
                jsonData[j] = JSON.parse(mask)
            }

            //load the record

            let query = `INSERT INTO ${command.parameters.excel_table} (nid, attributes, wkb_geometry, category_id) 
                         VALUES(($1::JSONB->>'nid')::BIGINT, 
                                 $1::JSONB, 
                                 (locus_core.geocoder($1)->0->>'wkb_geometry')::GEOMETRY, 
                                 (SELECT category_id FROM locus_core.categories WHERE category = $2)
                                 ) 
                         ON CONFLICT(nid) DO NOTHING`


            command['query'] = query;

            await runQuery(command, [jsonData[j], command.parameters.category])


        } catch (e) {

            us({message: 'Error in record load', error: e, e_message: e.message, data: jsonData[j]})
        }
    }

    us({message: 'Data loaded, refreshing global_search_view', records_loaded: count})

    //post preocess
    let ppSQL = command.sqlFile ? await utils.runQuery(command) : {message: 'No SQL File provided'}
    us({message: "Post Process complete", details: ppSQL})

    //Refresh the materialized view
    command['query'] = 'REFRESH MATERIALIZED VIEW CONCURRENTLY locus_core.global_search_view'
    return await runQuery(command)
}