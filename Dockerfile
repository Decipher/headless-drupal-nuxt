FROM node:8.12.0-alpine

COPY . /app/
WORKDIR /app/

RUN set -xe \
    && apk add --no-cache bash git openssh

RUN npm install

ENV HOST 0.0.0.0
EXPOSE 3000

CMD ["npm", "run", "start"]
