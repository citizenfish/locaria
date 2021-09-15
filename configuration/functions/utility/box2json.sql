CREATE OR REPLACE FUNCTION locus_core.box2json(geometry_param GEOMETRY) RETURNS JSON AS
$$
BEGIN

    RETURN CONCAT('[',REPLACE(REGEXP_REPLACE((Box2D(geometry_param))::TEXT, '[^0-9\-. ,]', '', 'g'), ' ', ','), ']')::JSONB;

END;
$$
LANGUAGE PLPGSQL