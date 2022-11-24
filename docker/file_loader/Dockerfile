FROM osgeo/gdal
WORKDIR /app

COPY .. .

RUN apt-get update
RUN apt install -y python3-pip

RUN pip3 install psycopg-binary
RUN pip3 install psycopg2-binary
RUN pip3 install boto3
RUN pip3 install requests
RUN pip3 install datetime

ENTRYPOINT python3 file_loader.py


