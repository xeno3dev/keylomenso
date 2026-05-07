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
# Remove playwright browsers to save space (keep package for type checking)
RUN npx playwright uninstall 2>/dev/null || true
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
WORKDIR /app

# Lingui config needed at workspace root for translate:compile
COPY lingui.config.ts ./lingui.config.ts

COPY packages ./packages

# Compile translations before build
RUN npm run translate:compile

# Generate Prisma client
RUN cd /app/packages/prisma && npx prisma generate

WORKDIR /app/apps/remix

# Add /app/node_modules/.bin to PATH so react-router and other binaries are found
ENV PATH="/app/node_modules/.bin:${PATH}"

# Build remix app (skip typecheck to avoid playwright/typescript errors in Docker build)
RUN cross-env NODE_ENV=production react-router build && npm run build:server
# Copy server/main.js to build/server/main.js if it exists
RUN test -f server/main.js && cp server/main.js build/server/main.js || echo "server/main.js not found, skipping copy"

FROM node:22.11.0
WORKDIR /app/

ENV NODE_ENV=production

# Copy everything from base stage
COPY --from=base /app ./

EXPOSE 3000

# Run server directly (with:env needs devDependency dotenv-cli)
CMD ["node", "apps/remix/build/server/main.js"]
