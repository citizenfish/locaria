CREATE OR REPLACE FUNCTION locaria_core.freetext_search(parameters JSONB)
RETURNS JSONB AS
    $$
DECLARE
    search_ts_query tsquery;
    loc_var JSONB;
    loc_search_var TEXT;
    search_var JSONB DEFAULT jsonb_build_object();
    limit_var INTEGER DEFAULT 30;
BEGIN

    --Step one we are parsing out a candidate location
    search_ts_query = locaria_core.prepare_ts_query(parameters->>'search_text', 'English');

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

    IF loc_var IS NOT NULL THEN
        loc_search_var = regexp_replace(lower(parameters->>'search_text'),lower(loc_var->0->>'name1'),'','gi');
        search_var = locaria_core.search(
            parameters || jsonb_build_object('format', 'datagrid',
                                                'search_text', loc_search_var,
                                                'limit', limit_var,
                                                'keyword_or', 'true',
                                                --DO NOT Remove or the same search called again ;-)
                                                'freetext', 'false',
                                                'location', loc_var->0->>'ewkt'));

    END IF;


    RETURN search_var || jsonb_build_object('loc_candidates', loc_var);

END;
$$ LANGUAGE  PLPGSQL;


