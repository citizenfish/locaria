DELETE FROM locus_core.parameters WHERE parameter_name = 'json_sources';

INSERT INTO locus_core.parameters(parameter_name, parameter)
SELECT 'json_sources',
       jsonb_build_object(
        'locus_core.events',
            jsonb_build_object(
                    'type','application/json',
                    'source','application/json',
                    'uri', 'https://www.surreyheath.gov.uk/events-json',
                               'sql', $SQL$

                                        INSERT INTO locus_core.events(nid,attributes, wkb_geometry, category)
                                        SELECT (($1::JSONB)#>>'{event,nid}')::BIGINT,
                                               (($1::JSONB)->'event') || jsonb_build_object('description', ($1::JSONB)->'event')::JSONB),
                                               locus_core.opennames_postcode_geocoder(($1::JSONB)#>>'{event,venue}'),
                                               ARRAY['Events']::locus_core.search_category[]
                                        ON CONFLICT (nid) DO UPDATE
                                        SET attributes = (($1::JSONB)->'event') || jsonb_build_object('description', (($1::JSONB)#>'{event}')::JSONB),
                                                         wkb_geometry = locus_core.opennames_postcode_geocoder(($1::JSONB)#>>'{event,venue}')

                                       $SQL$,
                               'json_key', 'events',
                               'last_run', now())
                           ,

        'locus_core.theatre_events',
            jsonb_build_object(
                'type','application/json',
                'source','application/json',
                'uri', 'https://www.camberleytheatre.co.uk/events-json',
                           'sql', $SQL$

                                    INSERT INTO locus_core.theatre_events(nid,attributes, wkb_geometry,category)
                                    SELECT (($1::JSONB)#>>'{event,nid}')::BIGINT,
                                           (($1::JSONB)->'event') || jsonb_build_object('description', (($1::JSONB)#>'{event}')::JSONB),
                                           locus_core.opennames_postcode_geocoder('GU15 3SY'),
                                           ARRAY['Events']::locus_core.search_category[]
                                    ON CONFLICT (nid) DO UPDATE
                                    SET attributes = (($1::JSONB)->'event') || jsonb_build_object('description', (($1::JSONB)#>'{event}')::JSONB)

                                   $SQL$,
                           'json_key', 'events',
                           'last_run', now())
                           ,

       'locus_core.flood_Warning',
            jsonb_build_object(
                'type','application/json',
                'source','application/json',
                'uri', 'https://environment.data.gov.uk/flood-monitoring/id/stations?lat=51.335117&long=-0.743987&dist=50',
                          'sql', $SQL$
                                    INSERT INTO locus_core.flood_Warning(nid, attributes, wkb_geometry,category)
                                    SELECT locus_core.base36_decode(($1::JSONB)#>>'{stationReference}')::BIGINT,
                                           jsonb_build_object('title', 'Flood warning', 'description', $1::JSONB),
                                           ST_GEOMFROMEWKT('SRID=4326;POINT('||(($1::JSONB)#>>'{long}')||' '||(($1::JSONB)#>>'{lat}')||')'),
                                           ARRAY['Environment']::locus_core.search_category[]
                                    ON CONFLICT (nid) DO UPDATE
                                    SET attributes = jsonb_build_object('title', 'Flood warning', 'description', $1::JSONB)
                                 $SQL$,
                          'json_key', 'items',
                          'last_run', now())
                          ,

        'locus_core.all_crime',
            jsonb_build_object(
                    'type','application/json',
                    'source','application/json',
                        'uri', 'https://data.police.uk/api/crimes-street/all-crime?poly=51.39372,-0.64394:51.37079,-0.74210:51.33331,-0.78027:51.27808,-0.73535:51.27794,-0.69469:51.31108,-0.68399:51.30929,-0.64500:51.31839,-0.61879:51.33036,-0.62176:51.33350,-0.57309:51.34777,-0.54477:51.36367,-0.55142:51.39423,-0.61150&date=CRIME-DATE',
                          'sql', $SQL$

                                    INSERT INTO locus_core.all_crime(nid,attributes, wkb_geometry,category)
                                    SELECT (($1::JSONB)#>>'{id}')::BIGINT,
                                           ($1::JSONB) || jsonb_build_object('description', ($1::JSONB)#>>'{category}', 'title', ($1::JSONB)#>>'{location,street,name}', 'ref', ($1::JSONB)#>>'{location,street,id}'),
                                           ST_GEOMFROMEWKT('SRID=4326;POINT('||(($1::JSONB)#>>'{location,longitude}')||' '||(($1::JSONB)#>>'{location,latitude}')||')'),
                                           ARRAY['Crime']::locus_core.search_category[]
                                    ON CONFLICT (nid) DO UPDATE
                                    SET attributes = ($1::JSONB) || jsonb_build_object('description', ($1::JSONB)#>>'{category}', 'title', ($1::JSONB)#>>'{location,street,name}', 'ref', ($1::JSONB)#>>'{location,street,id}')

                                 $SQL$,
                          'json_key', '',
                           'last_run', now() - INTERVAL '1 day'),
        'locus.councillor_details_view',
        jsonb_build_object(
                'type','text/html',
                'source','application/sql',
                'uri', 'SELECT id,linkuri FROM locus.councillor_details_view',
                'sql', $SQL$

					   UPDATE locus.councillor_details_view
					   SET json_data = ($1::JSONB) - 'id'
					   WHERE id = (($1::JSONB)#>>'{id}')::BIGINT


                       $SQL$,
                'selectors', jsonb_build_array(
                    jsonb_build_object('name','address','selector','.mgUserBody > p:nth-child(3)','regex','Correspondence address:'),
                    jsonb_build_object('name','phone','selector','.mgUserBody > p:nth-child(4)','regex','Phone:'),
                    jsonb_build_object('name','email','selector','.mgUserBody > p:nth-child(5) > a:nth-child(2)'),
                    jsonb_build_object('name','image','selector','.mgBigPhoto > img:nth-child(1)','attr','src','prepend','https://surreyheath.moderngov.co.uk/')
                    ),
                'last_run', now() - INTERVAL '1 day')

       );




DROP TABLE IF EXISTS locus_core.events;

CREATE TABLE locus_core.events (
       nid BIGINT PRIMARY KEY
) INHERITS (locus_core.base_table);

DROP TABLE IF EXISTS locus_core.theatre_events;

CREATE TABLE locus_core.theatre_events (
    nid BIGINT PRIMARY KEY
)INHERITS(locus_core.base_table);

DROP TABLE IF EXISTS locus_core.flood_warning;

CREATE TABLE locus_core.flood_warning (
       nid BIGINT PRIMARY KEY
) INHERITS (locus_core.base_table);

DROP TABLE IF EXISTS locus_core.all_crime;
CREATE TABLE locus_core.all_crime(
    nid BIGINT PRIMARY KEY
) INHERITS (locus_core.base_table);