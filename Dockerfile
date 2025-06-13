FROM node:22-slim

WORKDIR /app/plug-n-auth

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
