DELETE FROM locaria_core.reports WHERE report_name ='thelist_events_post_process';

INSERT INTO locaria_core.reports(report_name, report_parameters, admin_privilege)
SELECT 'thelist_events_post_process',
       jsonb_build_object('sql',
$SQL$
ALTER TABLE locaria_uploads.thelist_events
ADD COLUMN json_tags JSONB,
ADD COLUMN json_schedules JSONB,
ADD COLUMN json_descriptions JSONB,
ADD COLUMN json_images JSONB,
ADD COLUMN json_links JSONB;

UPDATE locaria_uploads.thelist_events
SET json_tags = tags::JSONB,
    json_schedules = schedules::JSONB,
    json_descriptions = descriptions::JSONB,
    json_images = images::JSONB,
    json_links = links::JSONB;

ALTER TABLE locaria_uploads.thelist_events
DROP COLUMN tags,
DROP COLUMN schedules,
DROP COLUMN descriptions,
DROP COLUMN images,
DROP COLUMN links;

ALTER TABLE locaria_uploads.thelist_events
RENAME COLUMN json_tags TO tags;
ALTER TABLE locaria_uploads.thelist_events
RENAME COLUMN json_schedules TO schedules;
ALTER TABLE locaria_uploads.thelist_events
RENAME COLUMN json_descriptions TO event_description;
ALTER TABLE locaria_uploads.thelist_events
RENAME COLUMN json_images TO images;
ALTER TABLE locaria_uploads.thelist_events
RENAME COLUMN json_links TO links;

SELECT jsonb_build_object('thelist_events_post_process', $1::JSONB)

$SQL$),
       TRUE;
