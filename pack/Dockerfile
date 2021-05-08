FROM node:latest as builder
RUN mkdir /app
RUN mkdir /app/config
RUN mkdir /app/files
WORKDIR /app
ADD server.js /app
ADD info.js /app
ADD serve.js /app
ADD appConfig.js /app
ADD package.json  /app
COPY build /app/build
RUN npm install
RUN node_modules/webpack-cli/bin/cli.js --config build/webpack.prod.conf.js
FROM node:latest
MAINTAINER Maciej Szulc
RUN mkdir /app
WORKDIR /app
COPY --from=builder /app/dist/server.js /app/server.js
COPY config /app/config
COPY files /app/files
EXPOSE 3000
ENTRYPOINT ["node", "server.js","--mode", "ENV"]
