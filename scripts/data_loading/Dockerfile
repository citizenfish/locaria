FROM node:12.21.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN apt-get --assume-yes update
RUN apt-get --assume-yes install gdal-bin

COPY . .


CMD [ "node", "load.js" ]