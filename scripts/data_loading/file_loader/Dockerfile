FROM python:3.8-slim-buster
WORKDIR /app

#gdal-bin has ogr2ogr tool which we use to load data
RUN apt-get --assume-yes update
RUN apt-get --assume-yes install gdal-bin

COPY .. .

RUN pip3 install psycopg
RUN pip3 install boto3

ENTRYPOINT python3 file_loader.py


