truncate table locaria_core.moderation_queue;
truncate table locaria_core.history;
truncate table locaria_core.logs;

truncate table locaria_data.businesses;
refresh materialized view locaria_data.global_search_view;

