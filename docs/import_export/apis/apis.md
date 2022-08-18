# Overview

APIs allow data to be imported to Locaria on a regular automated basis. The imports are actioned by pg_cron.

APIs are configured in two tables:-

- parameters <- holds the global api configuration in the parameter **installed_apis** and also holds api specific parameters in:-
  - thelist_events
  - crime_loader
  - os_opendata_loader
  - flood_loader
  - reed_jobs
  - planning_loader
- files <- holds a file record for each API that is to be run on a regular basis

## Parameters

### installed_apis

This parameter is a JSON object of api names with the following mandatory configuration items for each:-

- custom_loader <- name of the custom_loader to run
- description <- a text description of the api
- component <- the react component to edit API settings

```json
{
  "custom_loader"  : "thelist_events",
  "description" : "An up to date list of events both locally andnationally",
  "component" : "the_list_events_configure"
  
}
```
## Files

An API file record must have the following set

- api <- set to true for an api
- cron <- hourly|daily|weekly|monthly
- auto_update <- true
- custom_loader <- one of:-
  - thelist_events
  - crime_loader
  - os_opendata_loader
  - flood_loader
  - reed_jobs
  - planning_loader