--tags

UPDATE locus_core.test_events
SET attributes = attributes - 'tags' ||
jsonb_build_object('tags', array_to_json(string_to_array(attributes#>>'{description,type}',','))::JSONB) - '{description,type}';


UPDATE locus_core.test_events
SET attributes = attributes ||
jsonb_build_object(
    'range_min',
    COALESCE(NULLIF(
            REGEXP_REPLACE(
                CASE WHEN attributes#>>'{description,primary_age_group}' ~* 'under|all|young|up'
                THEN '0'
                ELSE
                    TRIM((regexp_split_to_array(attributes#>>'{description,primary_age_group}','-|to'))[1])
                END,
                '[^0-9]','','g'),
                ''),
             '0')::INTEGER,
    'range_max',
    COALESCE(NULLIF(
            REGEXP_REPLACE(
                CASE WHEN attributes#>>'{description,primary_age_group}' ~* 'all|young'
                THEN '18'
                ELSE
                    TRIM((regexp_split_to_array(attributes#>>'{description,primary_age_group}','-|to'))[2])
                END,
                '[^0-9]','','g'),
        ''),
             '18')::INTEGER
);

--end dates

UPDATE locus_core.test_events
SET attributes = attributes || jsonb_build_object('end_date',

to_char(NOW() + INTERVAL '60 days', 'DD/MM/YYYY HH24:MI:SS')
);

REFRESH MATERIALIZED VIEW  locus_core.global_search_view;