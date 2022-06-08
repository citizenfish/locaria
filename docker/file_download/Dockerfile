FROM osgeo/gdal
WORKDIR /app

COPY .. .

RUN apt-get update
RUN apt install -y python3-pip

RUN pip3 install psycopg
RUN pip3 install boto3
RUN pip3 install requests
RUN pip3 install datetime
RUN pip3 install XlsxWriter
RUN pip3 install pandas

ENTRYPOINT python3 file_download.py


