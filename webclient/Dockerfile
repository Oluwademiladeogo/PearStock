ARG NEXT_PUBLIC_API_URL

FROM node:18-alpine

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]