FROM node:12.21.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9002

CMD [ "node", "server.js" ]