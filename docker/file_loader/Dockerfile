FROM osgeo/gdal
WORKDIR /app

COPY .. .

RUN apt-get update
RUN apt install -y python3-pip

RUN pip3 install psycopg
RUN pip3 install boto3

ENTRYPOINT python3 file_loader.py


