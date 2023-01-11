FROM python:3
WORKDIR /app

COPY .. .

RUN pip3 install bs4
RUN pip3 install psycopg
RUN pip3 install psycopg-binary
RUN pip3 install psycopg2-binary
RUN pip3 install boto3
RUN pip3 install requests
RUN pip3 install datetime
RUN pip3 install more_itertools

ENTRYPOINT ["./openactive_mode.sh"]
CMD ["-m load", "-d"]
