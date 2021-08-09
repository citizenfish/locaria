FROM node:12.21.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN apt-get update
RUN apt-get --assume-yes install gdal-bin

COPY . .

EXPOSE 9002

CMD [ "node", "server.js" ]