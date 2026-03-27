FROM node:23-slim

WORKDIR /app

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

RUN npm install -g concurrently

COPY package*.json ./
RUN npm install

COPY . .

RUN touch .env

EXPOSE 8000
EXPOSE 8080

ENV PORT=8080

CMD ["concurrently", "--kill-others", "--prefix", "name", "-n", "client,server", "-c", "bgBlue,bgGreen", "npm run client:start", "npm run server"]
