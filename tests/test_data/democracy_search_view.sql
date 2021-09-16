CREATE VIEW locus_core.democracy_search_view AS
SELECT nid AS id,
	   wkb_geometry,
	   now() AS search_date,
	   attributes || jsonb_build_object('table', tableoid::regclass::text) AS attributes,
	   (SELECT category_id FROM locus_core.categories WHERE category = 'Democracy') AS category_id
FROM locus_data.test_democracy
WHERE wkb_geometry IS NOT NULL