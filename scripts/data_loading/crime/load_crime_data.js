const {runQuery,fetch_sync} = require('../load_utils')
const crimeURL = 'https://data.police.uk/api/crimes-street/all-crime'

const crime_table_sql = './crime/crime_table.sql'
const default_table = 'locus_core.all_crime'

module.exports.load_crime_data = async (command, us) => {

    if(!command.parameters.la_polygon) {
        throw {error : 'Local authority polygon required to load crime data'}
    }

    us({message: `Running ${crime_table_sql}`})
    command['sqlFile'] = crime_table_sql
    let sql = await runQuery(command)
    delete command['sqlFile']
    us({message : 'crime SQL run', detail :sql})

    //Retrieve crime data for polygon provided

    let url = `${crimeURL}?poly=${command.parameters.la_polygon}`
    let crimes = await fetch_sync(url)
    us({message: `${crimes.length} crimes retrieved`, details : url})

    let query = `INSERT INTO ${command.parameters.crime_table || default_table} (nid,attributes, wkb_geometry, category) VALUES($1::BIGINT, $2::JSONB, ST_GEOMFROMEWKT($3), ARRAY['Crime']::locus_core.search_category[]) ON CONFLICT(nid) DO NOTHING`

    command['query'] = query

    for (let i in crimes) {

        let attributes = {...crimes[i], ...{ref: crimes[i].location.street.id, title: crimes[i].location.street.name, description:  { type: crimes[i].category, text : crimes[i].category +' '+crimes[i].month}}}

        await runQuery(command, [attributes.id, attributes, `SRID=4326;POINT(${attributes.location.longitude} ${attributes.location.latitude})`])
    }

    us({message: 'Crime loaded, refreshing global_search_view'})

    //Refresh the materialized view
    command['query'] = 'REFRESH MATERIALIZED VIEW CONCURRENTLY locus_core.global_search_view'
    return await runQuery(command)

}