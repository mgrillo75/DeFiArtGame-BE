FROM node:17 AS base

WORKDIR /usr/defiartgame-backend
COPY package.json .env ./


FROM base as release
COPY . .

RUN yarn install
RUN yarn build
CMD yarn migrate && yarn start
