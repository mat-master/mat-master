FROM node:16.15.0-buster-slim as builder

WORKDIR /app

COPY build.js ./
COPY ../database/schema.prisma ./

CMD [ "node", "build.js" ]