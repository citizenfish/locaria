CREATE OR REPLACE FUNCTION locaria_core.preview_file_data(parameters JSONB) RETURNS TABLE(

    ogc_fid      BIGINT,
    attributes   JSONB,
    wkb_geometry GEOMETRY
)  AS
$$
    DECLARE

        query TEXT DEFAULT $SQL$
                SELECT ogc_fid::BIGINT,
                row_to_json(T.*)::JSONB -'wkb_geometry' AS attributes,
                wkb_geometry
                FROM %s T
                OFFSET $1
                LIMIT $2
        $SQL$;

        limit_var INTEGER DEFAULT 10;
        offset_var INTEGER DEFAULT 0;

BEGIN
    SET SEARCH_PATH = 'locaria_uploads','locaria_core','public';

    --cope with missing geometry field
    IF NOT EXISTS (SELECT 1
                   FROM information_schema.columns
                   WHERE table_schema='locaria_uploads' AND table_name=parameters->>'table' AND column_name='wkb_geometry') THEN

        IF COALESCE(parameters->>'_geocoder_type','') != '' THEN

        --attempt  geocoding

        query = $SQL$
                SELECT ogc_fid,
                       attributes,
                       (geocoder($3 || attributes)->0->>'wkb_geometry')::GEOMETRY AS wkb_geometry
                FROM (
                SELECT ogc_fid::BIGINT,
                    row_to_json(T.*)::JSONB -'wkb_geometry' AS attributes
                    FROM %s T
                    OFFSET $1
                    LIMIT $2
                ) SUB
                $SQL$;
        ELSE
            query = $SQL$
                SELECT ogc_fid::BIGINT,
                row_to_json(T.*)::JSONB  AS attributes,
                null::GEOMETRY AS wkb_geometry
                FROM %s T
                OFFSET $1
                LIMIT $2
            $SQL$;
        END IF;
    END IF;

    limit_var = COALESCE(parameters->>'limit', limit_var::TEXT)::INTEGER;
    offset_var = COALESCE(parameters->>'offset', offset_var::TEXT)::INTEGER;

    RETURN QUERY EXECUTE format(
        query, parameters ->> 'table'
        ) USING offset_var,limit_var,parameters;
END;
$$  LANGUAGE PLPGSQL;
