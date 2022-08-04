# report

report runs a custom SQL report retrieved from the reports table and returns the results in JSON format.

The method can be called from both public and internal gateways. 

The public gateway sets the admin_privelege_parameter to false, the internal gateway sets it to true. Each report has  the admin_privelege set to true or false and the parameter received is used to decide whether or not to run the report.

The acl is also passed into this function and can be used as a fine grained acl mechanism to run the report. 

Reports are run with reduced priveleges as granted to the locaria_report_user

## Parameters

## report_name

Default:  NULL
Type: String

The name of the report to run

## parameters

The entire parameter structure passed to the gateway is available to the report SQL as parameter $1

## Returns

A custom JSON structure specific to the report that has been requested