--TODO make proper post process report
UPDATE locaria_data.imports
SET attributes = attributes || jsonb_build_object('tags',
                                                  jsonb_build_array(
                                                          REGEXP_REPLACE(attributes#>>'{data,siccode.sictext_1}', '^[0-9]+ \- ', '','g'),
                                                          REGEXP_REPLACE(attributes#>>'{data,siccode.sictext_2}', '^[0-9]+ \- ', '','g'),
                                                          REGEXP_REPLACE(attributes#>>'{data,siccode.sictext_3}', '^[0-9]+ \- ', '','g')
                                                      ) -''
    )
WHERE category_id=298;


UPDATE locaria_data.imports
SET attributes = attributes || jsonb_build_object(
        'description', jsonb_build_object('text', attributes#>>'{description,text}',
                                          'title', attributes#>>'{description,title}',
                                          'url', attributes#>>'{data,uri}')
    )
WHERE category_id=298

UPDATE locaria_data.imports
SET attributes = attributes || jsonb_build_object('data', attributes->'data' || jsonb_build_object('add1', COALESCE(attributes#>>'{data,regaddress.addressline1}',''),
                                                                                                   'add2', COALESCE(attributes#>>'{data,regaddress.addressline2}',''),
                                                                                                   'add3', COALESCE(attributes#>>'{data,regaddress.addressline3}',''),
                                                                                                   'postcode', attributes#>>'{data,regaddress.postcode}'))

WHERE category_id=298