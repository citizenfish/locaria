CREATE OR REPLACE FUNCTION locaria_core.get_preview_file_data(parameters JSONB) RETURNS TABLE(

    ogc_fid      BIGINT,
    attributes   JSONB,
    wkb_geometry GEOMETRY
)  AS
$$
    DECLARE

        query TEXT DEFAULT $SQL$
                (SELECT ogc_fid::BIGINT,
                row_to_json(T.*)::JSONB -'wkb_geometry' AS attributes,
                ST_TRANSFORM(wkb_geometry,4326) AS wkb_geometry
                FROM %1$s T
                OFFSET $1
                LIMIT $2) SUB
        $SQL$;

        header TEXT DEFAULT $SQL$
            SELECT ogc_fid,
                   jsonb_build_object('description', jsonb_build_object('title', COALESCE(attributes->>'%2$s', attributes->>'title', attributes->>'name', attributes->>'description',''),
                                                                        'text',  COALESCE(attributes->>'%3$s',attributes->>'text', attributes->>'description',''),
                                                                        'url',   COALESCE(attributes->>'%4$s',attributes->>'url', attributes->>'website', attributes->>'link','')),
                                      'data', attributes) AS attributes,
                   wkb_geometry
            FROM
        $SQL$;
        limit_var INTEGER DEFAULT 10;
        offset_var INTEGER DEFAULT 0;
        table_var TEXT DEFAULT '';
        title_field_var TEXT DEFAULT 'THISWILLLFAIL';
        text_field_var  TEXT DEFAULT 'THISWILLLFAIL';
        url_field_var TEXT DEFAULT 'THISWILLLFAIL';
BEGIN
    SET SEARCH_PATH = 'locaria_uploads','locaria_core','public';

    --restrict to only locaria_uploads schema and remove any attempt to go into another schema
    table_var = parameters->>'table';
    table_var = 'locaria_uploads.' || COALESCE(NULLIF(split_part(table_var, '.', 2),''),NULLIF(split_part(table_var, '.', 1),''));

    --try to map required fields
    title_field_var = COALESCE(parameters->>'title_field', title_field_var);
    text_field_var  = COALESCE(parameters->>'text_field', text_field_var);
    url_field_var  = COALESCE(parameters->>'url_field', url_field_var);


    --cope with missing geometry field
    IF (SELECT 1
        FROM information_schema.columns
        WHERE table_schema='locaria_uploads' AND table_name= REPLACE(parameters->>'table','locaria_uploads.','') AND column_name='wkb_geometry')  IS NULL THEN

        IF COALESCE(parameters->>'_geocoder_type','') != '' THEN

        --attempt  geocoding
            header = REPLACE(header, 'wkb_geometry', $SQL$(geocoder($3 || attributes)->0->>'wkb_geometry')::GEOMETRY AS wkb_geometry$SQL$);
            query = $SQL$
                    (SELECT  ogc_fid::BIGINT,
                             row_to_json(T.*)::JSONB -'wkb_geometry' AS attributes
                             FROM %1$s T
                             OFFSET $1
                             LIMIT $2
                    ) SUB
                    $SQL$;
        ELSE
            query = $SQL$
                (SELECT ogc_fid::BIGINT,
                        row_to_json(T.*)::JSONB  AS attributes,
                        null::GEOMETRY AS wkb_geometry
                        FROM %1$s T
                        OFFSET $1
                        LIMIT $2
                ) SUB
            $SQL$;
        END IF;
    END IF;

    limit_var = COALESCE(parameters->>'limit', limit_var::TEXT)::INTEGER;
    offset_var = COALESCE(parameters->>'offset', offset_var::TEXT)::INTEGER;

    RAISE NOTICE '%', header;
    RAISE NOTICE '%',query;

    RETURN QUERY EXECUTE format(
        header||query, table_var,title_field_var,text_field_var,url_field_var
        ) USING offset_var,
                limit_var,
                jsonb_build_object('_geocoder_type', parameters->>'_geocoder_type',
                                   'postcode_field', COALESCE(parameters->>'postcode_field', 'postcode'),
                                   'x_field', parameters->>'x_field',
                                   'y_field', parameters->>'y_field');

EXCEPTION WHEN OTHERS THEN

    END;
$$  LANGUAGE PLPGSQL;
