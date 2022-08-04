# Overview

We need a capability for users to download their data into a format that can be edited and re-uploaded

This will support two formats:-

- Excel spreadsheet
- geojson

But we may want to add new spatial formats in future such as GeoPackage/Shapefile etc...

The data will be segmented into categories and will also allow for filters. Default will be to pull this from the live view with each item flagged as in/out of search view accordingly.

It will run from the files table with a new set of status as follows:-

- DONWLOAD_REQUESTED
- DOWNLOAD_COMPLETE
- DOWNLOAD_ERROR

A Docker container will be created and python script file_download.py in order to support multiple file formats and delivery of the downloaded file to Amazon S3

This requires changes to:-

- files_trigger.sql -> fire a different docker type for a download request
- docker/ -> create a new container to cope with download requests (base on GDAL so we can use ogr2ogr for spatial formats)




