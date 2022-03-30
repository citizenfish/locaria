DELETE FROM locaria_core.reports WHERE report_name ='crime_post_process';

INSERT INTO locaria_core.reports(report_name, report_parameters, admin_privilege)
SELECT 'crime_post_process',
       jsonb_build_object('sql',

$SQL$
    DO
    $$
    DECLARE
        ret_var JSONB DEFAULT jsonb_build_object();
        c_count INTEGER;
        category_id_var INTEGER;
    BEGIN

        DROP TABLE IF EXISTS crime_post_process_output;

        CREATE TABLE IF NOT EXISTS locaria_data.crime_neighbourhoods( neighbourhood_id TEXT primary key) INHERITS(locaria_data.base_table);
        CREATE TABLE IF NOT EXISTS locaria_data.crime_streetcrimes( crime_id TEXT primary key) INHERITS(locaria_data.base_table);
        CREATE TABLE IF NOT EXISTS locaria_data.crime_outcomes( outcome_id TEXT primary key) INHERITS(locaria_data.base_table);
        CREATE TABLE IF NOT EXISTS locaria_data.crime_teams( team_id TEXT primary key) INHERITS(locaria_data.base_table);
        CREATE TABLE IF NOT EXISTS locaria_data.crime_events( event_id TEXT primary key) INHERITS(locaria_data.base_table);
        CREATE TABLE IF NOT EXISTS locaria_data.crime_priorities( priority_id TEXT primary key) INHERITS(locaria_data.base_table);

        INSERT INTO locaria_core.categories(category)
        VALUES('Crime')
        ON CONFLICT(category) DO NOTHING;

        SELECT id into category_id_var
        FROM locaria_core.categories WHERE category = 'Crime';

        IF category_id_var IS NULL THEN
            RAISE EXCEPTION 'Missing Crime Category';
        END IF;

        -- ** CRIME DATA ** --
        IF (SELECT 1 FROM information_schema.tables WHERE table_schema = 'locaria_uploads' AND table_name='crime_streetcrimes') IS NOT NULL THEN
            INSERT INTO locaria_data.crime_streetcrimes(crime_id, category_id, attributes, wkb_geometry, search_date)
            SELECT CASE WHEN persistent_id IS NULL THEN concat(id,month,neighbourhood,force) ELSE persistent_id END,
                   category_id_var,
                   jsonb_build_object('description', jsonb_build_object('title', category, 'text', concat_ws(' ', category, location_street_name)),
                                      'data', jsonb_build_object('outcome_status',          outcome_status,
                                                                 'outcome_status_category', outcome_status_category,
                                                                 'outcome_status_date',     to_date(outcome_status_date, 'YYYY-MM'),
                                                                 'location_type',           location_type,
                                                                 'location_subtype',        location_subtype,
                                                                 'location_street_id',      location_street_id,
                                                                 'force',                   force,
                                                                 'neighbourhood',           neighbourhood),
                                      'tags',                    jsonb_build_array('crime')),
                   wkb_geometry,
                   to_date("month", 'YYYY-MM')
            FROM locaria_uploads.crime_streetcrimes
            ON CONFLICT(crime_id) DO NOTHING;

            GET DIAGNOSTICS c_count = ROW_COUNT;
            ret_var = jsonb_build_object('crime_inserts', c_count);
            --TRUNCATE locaria_uploads.crime_streetcrimes;
        END IF;

        -- *** OUTCOME DATA ** --
        IF (SELECT 1 FROM information_schema.tables WHERE table_schema = 'locaria_uploads' AND table_name='crime_outcomes') IS NOT NULL THEN
            INSERT INTO locaria_data.crime_outcomes(outcome_id, category_id, attributes, wkb_geometry,search_date)
            SELECT CASE WHEN crime_persistent_id IS NULL THEN concat(crime_id,crime_month,neighbourhood,force) ELSE crime_persistent_id END,
                   category_id_var,
                   jsonb_build_object('description', jsonb_build_object('title', crime_location_street_name,
                                                                        'text',  category_name),
                                      'data',       jsonb_build_object('category_code', category_code,
                                                                       'category_name', category_name,
                                                                       'person_id',     person_id,
                                                                       'crime_location_type', crime_location_type,
                                                                       'crime_location_street_id', crime_location_street_id,
                                                                       'crime_location_street_name', crime_location_street_name,
                                                                       'crime_context', crime_context,
                                                                       'crime_persistent_id', crime_persistent_id,
                                                                       'crime_id', crime_id,
                                                                       'crime_location_subtype', crime_location_subtype,
                                                                       'force', force,
                                                                       'neighbourhood', neighbourhood),
                                      'tags', jsonb_build_array('outcome', category_code,crime_category)),
                   wkb_geometry,
                   to_date("date", 'YYYY-MM')
            FROM locaria_uploads.crime_outcomes
            ON CONFLICT(outcome_id) DO NOTHING;

            GET DIAGNOSTICS c_count = ROW_COUNT;
            ret_var = ret_var || jsonb_build_object('outcome_inserts', c_count);
            --TRUNCATE locaria_uploads.crime_outcomes;
        END IF;

        -- ** NEIGHBOURHOOD BOUNDARIES ** --
        IF (SELECT 1 FROM information_schema.tables WHERE table_schema = 'locaria_uploads' AND table_name='crime_neighbourhoods') IS NOT NULL THEN
            TRUNCATE locaria_data.crime_neighbourhoods;
            INSERT INTO locaria_data.crime_neighbourhoods(neighbourhood_id, category_id, attributes, wkb_geometry,search_date)
            SELECT id,
                   category_id_var,
                   jsonb_build_object('description', jsonb_build_object('title', "name", 'text', concat_ws(' ', "name", 'Police Neighbourhood')),
                                      'data', (row_to_json(N.*)::JSONB || jsonb_build_object('neighbourhood', id))  - 'centre_longitude' - 'centre_latitude' -'wkb_geometry' - 'ogc_fid' -'id',
                                      'tags', jsonb_build_array('neighbourhood')
                       ) AS e_attributes,
                   wkb_geometry,
                   now()
            FROM locaria_uploads.crime_neighbourhoods N;

            GET DIAGNOSTICS c_count = ROW_COUNT;
            ret_var = ret_var || jsonb_build_object('neighbourhood_inserts', c_count);
            --TRUNCATE locaria_uploads.crime_neighbourhoods;
        END IF;

        -- ** CRIME EVENTS ** --
        IF (SELECT 1 FROM information_schema.tables WHERE table_schema = 'locaria_uploads' AND table_name='crime_events') IS NOT NULL THEN
            TRUNCATE locaria_data.crime_events;
            INSERT INTO locaria_data.crime_events(event_id, category_id, attributes, wkb_geometry,search_date)
            SELECT concat_ws('-',row_number() OVER (), "month"),
                   category_id_var,
                   jsonb_build_object('description', jsonb_build_object('title', event->>'title', 'description', event->'description'),
                                      'data', jsonb_build_object('force', force, 'neighbourhood', neighbourhood) || event - 'title' - 'description' - 'type',
                                      'tags', jsonb_build_array(event->>'type', 'event')
                       ),
                   wkb_geometry,
                   to_date("month", 'YYYY-MM')

            FROM (
                     SELECT wkb_geometry,
                            force,
                            neighbourhood,
                            jsonb_array_elements(event::JSONB) as event,
                         month
                     FROM locaria_uploads.crime_events
                 ) E;

            GET DIAGNOSTICS c_count = ROW_COUNT;
            ret_var = ret_var || jsonb_build_object('event_inserts', c_count);
            --TRUNCATE locaria_uploads.crime_events;

        END IF;

        -- ** CRIME TEAMS ** --
        IF (SELECT 1 FROM information_schema.tables WHERE table_schema = 'locaria_uploads' AND table_name='crime_teams') IS NOT NULL THEN
            TRUNCATE locaria_data.crime_teams;
            INSERT INTO locaria_data.crime_teams(team_id, category_id, attributes, wkb_geometry,search_date)
            SELECT concat_ws('-',row_number() OVER (), "neighbourhood"),
                   category_id_var,
                   jsonb_build_object('description', jsonb_build_object('title', member->>'name', 'description', COALESCE(member->>'bio','')),
                                      'data', jsonb_build_object('neighbourhood', neighbourhood, 'force', force) || member - 'name' - 'bio',
                                      'tags', jsonb_build_array('team')
                       ),
                   wkb_geometry,
                   now()
            FROM (
                     SELECT wkb_geometry,
                            force,
                            neighbourhood,
                            jsonb_array_elements(team::JSONB) as member
                     FROM locaria_uploads.crime_teams
                 ) E;

            GET DIAGNOSTICS c_count = ROW_COUNT;
            ret_var = ret_var || jsonb_build_object('teams_inserts', c_count);
            --TRUNCATE locaria_uploads.crime_teams;
        END IF;

        -- CRIME PRIORITies ** --
        IF (SELECT 1 FROM information_schema.tables WHERE table_schema = 'locaria_uploads' AND table_name='crime_priorities') IS NOT NULL THEN
            TRUNCATE locaria_data.crime_priorities;
            INSERT INTO locaria_data.crime_priorities(priority_id, category_id, attributes, wkb_geometry,search_date)
            SELECT concat_ws('-',row_number() OVER (), "neighbourhood"),
                   category_id_var,
                   jsonb_build_object('description', jsonb_build_object('title', SUBSTRING(regexp_replace(priority->>'issue', E'<[^>]+>', '', 'gi'), 1, 30)||' ...', 'description', priority->>'issue'),
                                      'data', jsonb_build_object('neighbourhood', neighbourhood, 'force', force) || priority,
                                      'tags', jsonb_build_array('priority')
                       ),
                   wkb_geometry,
                   now()
            FROM (
                     SELECT wkb_geometry,
                            force,
                            neighbourhood,
                            jsonb_array_elements(priority::JSONB) as priority
                     FROM locaria_uploads.crime_priorities
                 ) E;

            GET DIAGNOSTICS c_count = ROW_COUNT;
            ret_var = ret_var || jsonb_build_object('priorities_inserts', c_count);
            --TRUNCATE locaria_uploads.crime_priorities;
        END IF;

        --REFRESH

        REFRESH MATERIALIZED VIEW CONCURRENTLY locaria_data.global_search_view;

        --Write results to temp table so can be read outside of DO
        CREATE TEMP TABLE crime_post_process_output AS
        SELECT ret_var;

EXCEPTION WHEN OTHERS THEN

        CREATE TEMP TABLE IF NOT EXISTS crime_post_process_output(error jsonb) ;
        INSERT INTO crime_post_process_output SELECT ret_var || jsonb_build_object('error', SQLERRM) ;

END;
$$;

SELECT * FROM crime_post_process_output C;

$SQL$),
TRUE;
