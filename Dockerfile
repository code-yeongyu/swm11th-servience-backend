# Dockerfile
FROM node:12
MAINTAINER YeonGyu Kim <code.yeon.gyu@gmail.com>

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn
RUN yarn global add pm2
RUN pm2 link t4ezml8edk8mg03 1m0nuqhss2blwuu
COPY . .

EXPOSE 3000

CMD ["pm2-runtime", "src/app.js", "-i", "max"]