const {runQuery, gets3File, streamLoader} = require('../loader_utils')
const XLSX = require('xlsx');

module.exports.load_excel = async (parameters, us) => {

    let jsonData = []
    let start = new Date().getTime();
    if (!parameters.file_path || !parameters.excel_table || !parameters.mapping) {
        us({id: parameters.id, status: 'ERROR', errorMessage: 'Missing Parameters', parameters: parameters})
        return {error: 'Missing Parameters'}
    }

    us({id: parameters.id, statusMessage: `Reading file ${parameters.file_path} from s3`})

    try {

        const file_contents = await gets3File(parameters.region, parameters.bucket, parameters.file_path, false)

        if(file_contents.error !== undefined) {
            return file_contents
        }

        let workbook = XLSX.read(file_contents, {type: "buffer"});

        ///** STEP 1 - read sheet into a JSON structure **//
        for (let s in workbook.SheetNames) {

            us({id: parameters.id, message: `Loading worksheet ${workbook.SheetNames[s]}`});
            let sheet_json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[s]]);

            sheet_json.map(function (row) {
                row._xls_sheet_name = workbook.SheetNames[s];
                return row;
            });

            if (workbook.SheetNames[s] === parameters.sheet_name) {
                jsonData = jsonData.concat(sheet_json);
                us({id: parameters.id, message: `Worksheet ${parameters.sheet_name} read into JSON structure`});
            }
        }


        //** Step 2 - Clear existing data if required **/
        let count = 0
        let errors = 0

        //Clear data if required
        if (parameters.truncate) {
            us({id: parameters.id, message: `Truncating ${parameters.excel_table}`})
            parameters['query'] = `TRUNCATE ${parameters.excel_table}`
            await runQuery(parameters)
        }

        //** Step 3 - Iterate through json records, format according to mask and insert into database **//

        let category_id  = await runQuery({query : `SELECT category_id FROM locus_core.categories WHERE category = '${parameters.category}'`})

        if(category_id.rows === undefined){
            category_id = 0
        } else{
            category_id = parseInt(category_id.rows[0].category_id)
        }

        for (let j in jsonData) {

            // TEST REMOVE
            //if(j > 5 )break
            //TEST

            try {
                //A mask allows you to format your Excel data into the required LOCUS structure on load
                let mask = JSON.stringify(parameters.mapping)

                for (let k in jsonData[j]) {

                    //substitute into mask and escape newlines and tabs etc..

                    let rgx = new RegExp(`__${k}__`, 'gm')
                    let replaceString = jsonData[j][k].replace(/[\"]/g, '\\"')
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

                if (parameters.non_mask) {
                    jsonData[j] = {category_id : category_id, data : JSON.stringify({...jsonData[j], ...JSON.parse(mask)})}

                } else {
                    jsonData[j] = {category_id : category_id, data : mask}
                }

            } catch (e) {
                count--
                errors++
                console.log(e)
                us({
                    id: parameters.id,
                    message: 'Error in record load',
                    error: e,
                    e_message: e.message,
                    data: jsonData[j]
                })


            }

        }

        //** Step 4 bulk load into database
        us({id: parameters.id, message: `Formatted data for load`})

        let bulkload = await streamLoader({table: parameters.excel_table, data: jsonData})

        if(bulkload.error !== undefined){
            return {error: bulkLoad.error}
        }

        us({id: parameters.id, message: `Loaded records into ${parameters.excel_table}`, loadStatus : bulkload})

        //** Step 5 run any post_process geocoding

        if(parameters.geocoder !== undefined){

            let query = `UPDATE ${parameters.excel_table} SET wkb_geometry = ST_SETSRID(ST_GEOMFROMGEOJSON(locus_core.geocoder(attributes || jsonb_build_object('_geocoder', $1::TEXT))->0->>'wkb_geometry'),4326)`
            let result = await runQuery({query: query}, [parameters.geocoder])

            us({id: parameters.id, message: `Geocoded records using ${parameters.geocoder}`, loadStatus : result})
            console.log(result)
        }

        return {message: "File Loaded", count: count, errors: errors, execution_time: new Date().getTime() - start}

    } catch (e) {
        console.log(JSON.stringify(e))
        return {error: e}
    }

}