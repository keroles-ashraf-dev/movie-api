# base
FROM node:18 AS base
WORKDIR /app
COPY package*.json ./

# development
FROM base AS dev
RUN npm install
COPY . .
EXPOSE $API_PORT
CMD [ "npm", "run", "up-dev" ]

# build
FROM base AS prod_build
RUN npm install
COPY . .
RUN npm run build

# production
FROM base AS prod
RUN npm install --only=production
COPY --from=prod_build app/dist/ ./dist
EXPOSE $API_PORT
CMD [ "npm", "run", "up-prod" ]
