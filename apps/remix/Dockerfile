FROM node:22.11.0-alpine AS development-dependencies-env
WORKDIR /app

# install deps first for better caching
COPY package*.json ./

RUN npm ci --ignore-engines

COPY . .


FROM node:22.11.0-alpine AS production-dependencies-env
WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev --ignore-engines


FROM node:22.11.0-alpine AS build-env
WORKDIR /app

COPY . .

COPY --from=development-dependencies-env /app/node_modules ./node_modules

RUN npm run build


FROM node:22.11.0-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=build-env /app/build ./build

EXPOSE 3000

CMD ["npm", "run", "start"]