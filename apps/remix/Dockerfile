FROM node:22.11.0 AS base
RUN apt-get update && apt-get install -y bash coreutils

WORKDIR /app/

# Copy package files first for better caching
COPY package*.json ./
COPY apps/remix/package*.json ./apps/remix/

# Install all dependencies including devDependencies
WORKDIR /app
RUN npm install --ignore-engines --legacy-peer-deps 2>&1 | grep -v "playwright" || true
# Rebuild optional dependencies (fixes rollup native module)
RUN npm rebuild rollup 2>&1 | grep -v "playwright" || true
# Remove playwright to save space (not needed for production build)
RUN rm -rf /app/node_modules/playwright* /app/node_modules/@playwright* 2>/dev/null || true
WORKDIR /app/apps/remix

# Now copy source code (excluding node_modules)
# Note: WORKDIR is /app/apps/remix, so ./app means /app/apps/remix/app
COPY apps/remix/app ./app
COPY apps/remix/server ./server
COPY apps/remix/public ./public
COPY apps/remix/tsconfig.json ./tsconfig.json
COPY apps/remix/.bin ./.bin
COPY apps/remix/docker-build.sh ./docker-build.sh
COPY apps/remix/rollup.config.mjs ./rollup.config.mjs
COPY apps/remix/vite.config.ts ./vite.config.ts

# Copy shared packages to /app/packages (monorepo root), not nested under apps/remix
WORKDIR /app
COPY packages ./packages
COPY packages/prisma ./packages/prisma
WORKDIR /app/apps/remix

# Set PATH to include node_modules/.bin
ENV PATH="/app/node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# Generate prisma client (needs to run from packages/prisma)
RUN cd /app/packages/prisma && npx prisma generate

# Build remix app
WORKDIR /app/apps/remix
RUN npm run build:app && npm run build:server
# Copy server/main.js to build/server/main.js if it exists
RUN test -f server/main.js && cp server/main.js build/server/main.js || echo "server/main.js not found, skipping copy"

FROM node:22.11.0
WORKDIR /app/

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev --ignore-engines --legacy-peer-deps

# Copy built remix app and config
COPY --from=base /app/apps/remix/build ./apps/remix/build
COPY --from=base /app/apps/remix/package.json ./apps/remix/package.json
COPY --from=base /app/apps/remix/public ./apps/remix/public

# Copy shared packages
COPY --from=base /app/packages ./packages

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=@documenso/remix"]
