FROM node:18
LABEL authors="vipulbhandare"

WORKDIR /usr/src/app

#RUN apt-get update && apt-get install -y nodejs npm \
#    curl \
#    gnupg \
#    build-essential

COPY package*.json ./

RUN npm install
RUN npm install -g npm-run-all

COPY ./dist ./dist
ARG APP_PORT=3000
ENV APP_PORT=${APP_PORT}

EXPOSE ${APP_PORT}

CMD ["npm", "run", "start:prod"]

## BUILD
#FROM node:18 as build
#WORKDIR /usr/src/app
#COPY ./package.json ./package.json
#RUN npm install
#COPY . .
#RUN npm run build
#RUN ls -la /usr/src/app
#
## DIST
#FROM node:18
#WORKDIR /usr/src/app
#COPY --from=build /usr/src/app/dist ./dist
#COPY --from=build /usr/src/app .
#RUN npm install
#
#ARG APP_PORT=3000
#ENV APP_PORT=${APP_PORT}
#
#EXPOSE ${APP_PORT}
#CMD [ "npm", "run", "start"]