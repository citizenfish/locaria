FROM python:3.8-slim-buster
WORKDIR /app

#gdal-bin has ogr2ogr tool which we use to load data
#RUN add-apt-repository ppa:ubuntugis/ppa
#RUN echo deb http://ftp.uk.debian.org/debian unstable main contrib non-free >> /etc/apt/sources.list
#RUN apt-get --assume-yes update
#RUN apt-get --assume-yes install gdal-bin gcc

# Install base utilities
RUN apt-get update
RUN apt-get --assume-yes install wget

RUN apt-get --assume-yes install gcc

# Install miniconda
ENV CONDA_DIR /opt/conda
RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh
RUN /bin/bash ~/miniconda.sh -b -p /opt/conda

# Put conda in path so we can use conda activate
ENV PATH=$CONDA_DIR/bin:$PATH

RUN conda install -c conda-forge gdal

COPY .. .

RUN pip3 install psycopg
RUN pip3 install boto3

ENTRYPOINT python3 file_loader.py


