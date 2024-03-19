FROM node:alpine3.18
WORKDIR /app
COPY ./package*.json ./
RUN npm install --omit=dev
COPY . .
CMD "node" "app.js"