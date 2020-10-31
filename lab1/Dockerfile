FROM node:latest
RUN mkdir /app
WORKDIR /app
ADD server.js /app
ADD package.json  /app
RUN npm install
ENTRYPOINT ["npm", "start"]