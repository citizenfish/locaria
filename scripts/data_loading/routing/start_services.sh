#!/bin/bash
echo "STARTING CAR on 5000"
osrm-routed --algorithm mld  --port 5000 --max-matching-size 50000 gb-latest-car.osrm &
echo "STARTING BICYCLE ON 5001"
osrm-routed --algorithm mld  --port 5001 --max-matching-size 50000 gb-latest-bicycle.osrm &
echo "STARTING FOOT ON 5002"
osrm-routed --algorithm mld  --port 5002 --max-matching-size 50000 gb-latest-foot.osrm
