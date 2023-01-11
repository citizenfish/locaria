FROM python:3
WORKDIR /app

COPY .. .

RUN pip3 install psycopg
RUN pip3 install boto3
RUN pip3 install requests
RUN pip3 install datetime

ENTRYPOINT python3 import_log_files.py