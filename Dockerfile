FROM node:16-alpine as build

RUN npm i -g pnpm

USER node

WORKDIR /home/node/app

COPY --chown=node:node package*.json pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

COPY --chown=node:node ./ ./

RUN pnpm run build


FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /home/node/app/dist /usr/share/nginx/html

EXPOSE 80