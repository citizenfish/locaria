# Partition management (logs)

https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL_Partitions.html

#pg_cron

https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL_pg_cron.html#PostgreSQL_pg_cron.enable


## Cross Database

https://github.com/citusdata/pg_cron/issues/151

Need to add parameter

```
Modify the parameter group associated with your PostgreSQL DB instance and add pg_cron to the shared_preload_libraries parameter value. This change requires a PostgreSQL DB instance restart to take effect. For more information, see Modifying parameters in a DB parameter group .
```

## Files processing

Regular file updates for items such as planning/crime/events will be carried out by pg_cron. This allows updates:-

- daily
- weekly
- monthly
- custom

A file is "reprocessed" by having its status changed back to REGISTERED which will cause a Fargate instance to spin up and process the file again. This means that files must be designed such that either a primary key is used to eliminate duplicate records or a time period used in selection. 

Cron updates will look at the _crontab attribute of a file:-

```json
{
  "_crontab": "daily|weekly|monthly|custom",
  "_contab_next" : <Timestamp>
}
```
The cron setup will have three records:-

- daily -> triggered at 12 midnight daily and updates any record with _crontab set to daily
- weekly -> triggered at 12 midnight on a Sunday and updates any record with _crontab set to weekly
- monthly -> triggered at 12 midnight on the first day of each month and updates any record with _crontab set to monthly
- custom -> triggered hourly and updates any record with _crontab_next set to be on that hour