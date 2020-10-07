# Dockerfile
FROM node:12
MAINTAINER YeonGyu Kim <code.yeon.gyu@gmail.com>

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn
COPY . .

EXPOSE 3000

CMD ["node", "src/app.js"]