FROM node:12-slim
RUN apt-get -y update && apt-get -y upgrade && apt-get -y install python
WORKDIR /usr/src/app
COPY package.json ./
RUN npm --quiet install
COPY webpack.config.js ./
COPY src src
COPY static static

ENV NODE_ENV=production
RUN SAPPER_TIMESTAMP=$(date +%s%3N)
RUN npm run build

ENTRYPOINT ["npm"]
CMD ["start"]
