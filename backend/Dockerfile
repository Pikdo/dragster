# FROM node:14.18.0
FROM node:14.18.0-alpine3.14

# RUN apt-get update -y && apt-get upgrade -y

COPY /WebSocketServer /home/node/app
WORKDIR /home/node/app
RUN npm install

# EXPOSE 80
#CMD node wsserver.js
CMD ["wsserver.js"]