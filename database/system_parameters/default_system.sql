DELETE
FROM locaria_core.parameters
WHERE parameter_name = 'systemMain';

INSERT INTO locaria_core.parameters(parameter_name, acl, parameter)
SELECT 'systemMain',
       'external',
       '{
         "mapXYZ": "https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=w69znUGxB6IW5FXkFMH5LQovdZxZP7jv",
         "mapBuffer": 50000,
         "defaultZoom": 15,
         "searchLimit": 40,
         "clusterCutOff": 5,
         "mapAttribution": "© Crown copyright and database rights 2022 OS",
         "clusterWidthMod": 20,
         "clusterAlgorithm": "KMEANS",
         "searchDistance": true,
         "searchLocation": true,
         "searchTags": true,
         "searchCategory": true
       }'::JSONB;