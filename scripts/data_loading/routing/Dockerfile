FROM osrm/osrm-backend

WORKDIR /data

COPY . .

RUN apt-get update && apt-get install -y --no-install-recommends curl

RUN curl http://download.geofabrik.de/europe/great-britain-latest.osm.pbf --output gb-latest.osm.pbf

#CAR
RUN cp gb-latest.osm.pbf gb-latest-car.osm.pbf
RUN osrm-extract -p /opt/car.lua gb-latest-car.osm.pbf
RUN osrm-partition gb-latest-car.osrm
RUN osrm-customize gb-latest-car.osrm
RUN rm -rf gb-latest-car.osm.pbf

#FOOT
RUN cp gb-latest.osm.pbf gb-latest-foot.osm.pbf
RUN osrm-extract -p /opt/foot.lua gb-latest-foot.osm.pbf
RUN osrm-partition gb-latest-foot.osrm
RUN osrm-customize gb-latest-foot.osrm
RUN rm -rf gb-latest-foot.osm.pbf

#BICYCLE
RUN cp gb-latest.osm.pbf gb-latest-bicycle.osm.pbf
RUN osrm-extract -p /opt/bicycle.lua gb-latest-bicycle.osm.pbf
RUN osrm-partition gb-latest-bicycle.osrm
RUN osrm-customize gb-latest-bicycle.osrm

#Remove downloaded files
RUN rm -rf gb-latest-bicycle.osm.pbf
RUN rm -rf gb-latest.osm.pbf


CMD ./start_services.sh

#CMD ["osrm-routed", "--algorithm", "mld", "gb-latest.osrm", "--max-matching-size","50000"]