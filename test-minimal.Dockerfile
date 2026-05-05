FROM node:22.11.0-alpine
RUN apk add --no-cache bash coreutils
WORKDIR /app/
COPY package*.json ./
COPY apps/remix/package*.json ./apps/remix/
RUN npm install --ignore-engines --legacy-peer-deps 2>&1 | tail -30
RUN ls /app/node_modules/.bin/ | grep react || echo 'No react-router'
RUN ls /app/node_modules/@react-router/ 2>&1 || echo 'No @react-router dir'
