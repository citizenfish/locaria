CREATE OR REPLACE FUNCTION locaria_core.freetext_search(parameters JSONB)
RETURNS JSONB AS
    $$
DECLARE
    search_ts_query tsquery;
    loc_var JSONB;
    loc_search_var TEXT;
    search_var JSONB DEFAULT jsonb_build_object();
    limit_var INTEGER DEFAULT 30;
    t timestamptz := clock_timestamp();
    t_var JSONB;
BEGIN

    --Step one we are parsing out a candidate location
    SELECT locaria_core.prepare_ts_query(parameters->>'search_text', 'English') INTO search_ts_query;

    SELECT json_agg(s.*)
    INTO loc_var
    FROM (
        SELECT *
        FROM (
                SELECT  attributes->>'name1' AS name1,
                        attributes ->> 'local_type' as local_type,
                        ST_ASEWKT(wkb_geometry) AS ewkt,
                        concat_ws(' ', attributes ->> 'county_unitary'::text, Concat('(',attributes ->> 'region'::text,')'))  AS region,
                        POSITION(LOWER(ATTRIBUTES ->> 'name1') IN LOWER(parameters ->> 'search_text')) AS name1_position
                FROM locaria_data.location_search_view
                WHERE jsonb_to_tsvector('simple'::regconfig, attributes, '["string","numeric"]'::jsonb) @@ search_ts_query
            ) loc
       ORDER BY name1_position DESC,
                array_position(ARRAY ['City', 'Town', 'Suburban Area', 'Village', 'Hamlet','Other Settlement', 'Postcode'],local_type)
       LIMIT 5
       ) S;

    t_var = jsonb_build_object('loc', clock_timestamp() - t);

    IF loc_var IS NOT NULL THEN
        loc_search_var = regexp_replace(lower(parameters->>'search_text'),lower(loc_var->0->>'name1'),'','gi');
        parameters = parameters || jsonb_build_object('format', 'datagrid',
                                                      'search_text', loc_search_var,
                                                      'display_limit', limit_var,
                                                      'limit', limit_var,
                                                      'keyword_or', 'true',
                                                      'location', loc_var->0->>'ewkt');

        SELECT  locaria_core.search(parameters) INTO search_var;

   END IF;

    t_var = t_var || jsonb_build_object('items', clock_timestamp() - t);

    RETURN search_var || jsonb_build_object('loc_candidates', loc_var, 'timings', t_var);

END;
$$ LANGUAGE  PLPGSQL;


