FROM node:12.21.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN apt-get --assume-yes update
RUN apt-get --assume-yes install gdal-bin
RUN apt-get --assume-yes install osm2pgrouting
RUN apt-get --assume-yes  install osmctools
COPY .. .


# CMD [ "node", "load.js" ]