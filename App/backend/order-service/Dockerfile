FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --verbose

COPY . .

EXPOSE 5003

CMD [ "npm", "start" ]