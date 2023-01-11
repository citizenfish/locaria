#!/bin/bash

mode="load"
debug="False"

while [[ $# -gt 0 ]];
do
  case $1 in
    -m|--mode)
      mode="$2"
      shift
      shift
      ;;
    -d|--debug)
      debug="True"
      shift
      ;;
    *)
      shift
      ;;
  esac
done

if [ $mode == "discover" ]
then
  echo "OpenActive discovery mode debug = ${debug}"
  python3 discoverFeeds.py $debug
else
  echo "OpenActive load mode debug = ${debug}"
  python3 feedProcessor.py $debug
fi