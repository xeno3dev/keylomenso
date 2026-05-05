FROM node:22.11.0-alpine AS base
RUN apk add --no-cache bash coreutils

WORKDIR /app/

# Copy package files first for better caching
COPY package*.json ./
COPY apps/remix/package*.json ./apps/remix/

# Install all dependencies including devDependencies
RUN npm install --ignore-engines --legacy-peer-deps

# Now copy source code (excluding node_modules)
COPY apps/remix/app ./apps/remix/app
COPY apps/remix/public ./apps/remix/public
COPY apps/remix/tsconfig.json ./apps/remix/
COPY packages ./packages
COPY prisma ./prisma

# Set PATH to include node_modules/.bin
ENV PATH="/app/node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# Generate prisma client
RUN cd packages/prisma && npx prisma generate

# Build remix app
WORKDIR /app/apps/remix
RUN react-router typegen && \
    NODE_ENV=production react-router build && \
    NODE_ENV=production npx rollup -c rollup.config.mjs


FROM node:22.11.0-alpine
WORKDIR /app/

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev --ignore-engines --legacy-peer-deps

# Copy built remix app
COPY --from=base /app/apps/remix/build ./apps/remix/build
COPY --from=base /app/apps/remix/server ./apps/remix/server
COPY --from=base /app/apps/remix/package.json ./apps/remix/package.json
COPY --from=base /app/apps/remix/public ./apps/remix/public

# Copy shared packages
COPY --from=base /app/packages ./packages

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=@documenso/remix"]
