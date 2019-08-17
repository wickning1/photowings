FROM node:12-slim
RUN apt-get -y update && apt-get -y upgrade && apt-get -y install python
WORKDIR /usr/src/app
ADD https://github.com/justadudewhohacks/face-api.js/raw/master/weights/ssd_mobilenetv1_model-shard1 ./weights/
ADD https://github.com/justadudewhohacks/face-api.js/raw/master/weights/ssd_mobilenetv1_model-shard2 ./weights/
ADD https://github.com/justadudewhohacks/face-api.js/raw/master/weights/ssd_mobilenetv1_model-weights_manifest.json ./weights/
ADD https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-shard1 ./weights/
ADD https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-weights_manifest.json ./weights/
ADD https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-shard1 ./weights/
ADD https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-shard2 ./weights/
ADD https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-weights_manifest.json ./weights/
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
