const {runQuery,fetch_sync,sleep} = require('../load_utils')
const planitURL = 'https://www.planit.org.uk/api'

const planning_table_sql = './planning/planning_table.sql'
const default_table = 'locus_core.planning_applications'
let page = 1000
let index = 0
let rate_limit = 5

module.exports.load_planning_data = async (command, us) => {


    if(!command.parameters.authority_id) {

        //https://www.planit.org.uk/api/areas/json?select=area_name,area_id

        throw {error : 'Local authority id (authority_id required to download data'}
    }

    //Create planning table if it does not already exist

    us({message: `Running ${planning_table_sql}`})
    command['sqlFile'] = planning_table_sql
    let sql = await runQuery(command)
    delete command['sqlFile']

    //Retrieve applications for location provided
    let url = `${planitURL}/applics/json?auth=${command.parameters.authority_id}&recent=${command.parameters.recent || 60}`;
    let applications = []
    let fetch = true
    let fetched = 0
    let remaining = 0
    while(fetch) {

        let results = await fetch_sync(`${url}&pg_sz=${page}&index=${index}`)

        if(results.records.length > 0) {
            applications = applications.concat(results.records)
        }

        us({message: `Fetching ${url}&pg_sz=${page}&index=${index}`})

        //We have retrieved everything
        if(results.total <= results.to + 1){
            fetch = false
        }

        remaining  = results.total - results.to + 1
        index = results.to + 1
        page = remaining > page ? page : remaining
        fetched ++

        if(fetched >= rate_limit){
            fetched = 0
            await sleep(60)
        }

    }

    //Load into planning table
    //TODO convert this into a bulk load

    us({message: `Loading ${applications.length} records into ${default_table}`})

    let query = `INSERT INTO ${command.parameters.planning_table || default_table} (attributes, wkb_geometry, category) VALUES($1::JSONB, ST_GEOMFROMEWKT($2), ARRAY['Planning']::locus_core.search_category[])`
    command['query'] = query

    for(let i in applications) {

        try {
            //Add in any pre-formatting here
            let attributes  = {...applications[i], ...{ref: applications[i].uid, title: applications[i].address, description: {text: applications[i].description, type: applications[i].app_type}}}

            await runQuery(command, [attributes, `SRID=4326;POINT(${applications[i].location_x} ${applications[i].location_y})`])

        } catch(e) {

            us({message: 'Error in record load', error: e, e_message: e.message, data: applications[i]})
        }
    }



    us({message: 'Refreshing global_search_view'})

    //Refresh the materialized view
    command['query'] = 'REFRESH MATERIALIZED VIEW CONCURRENTLY locus_core.global_search_view'
    return await runQuery(command)

}