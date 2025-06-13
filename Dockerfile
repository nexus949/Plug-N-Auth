FROM node:22-slim

WORKDIR /app/plug-n-auth

COPY package*.json ./

RUN npm install

#environment variables
ARG DB_URL
ARG JWT_KEY
ENV DB_URL=${db_REMOTE_URL}
ENV JWT_KEY=${JWT_SECRET_KEY}

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
