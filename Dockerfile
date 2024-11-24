FROM node:18
LABEL authors="vipulbhandare"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g npm-run-all

COPY ./dist ./dist
ARG APP_PORT=3000
ENV APP_PORT=${APP_PORT}

EXPOSE ${APP_PORT}

CMD ["npm", "run", "start:prod"]