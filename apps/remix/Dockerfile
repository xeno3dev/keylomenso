FROM node:22.11.0 AS base
RUN apt-get update && apt-get install -y bash coreutils

WORKDIR /app/

# Copy full monorepo structure (excluding node_modules) for proper npm workspaces resolution
# Copy root config files
COPY package*.json ./
COPY tsconfig.json ./
COPY turbo.json ./
COPY .npmrc ./

# Copy apps/remix with all source
COPY apps/remix ./apps/remix/

# Copy packages with all source (npm workspaces need full structure)
COPY packages ./packages/

# Lingui config needed at workspace root for translate:compile
COPY lingui.config.ts ./lingui.config.ts

# Install all dependencies (npm workspaces will hoist to /app/node_modules)
RUN npm install --ignore-engines --legacy-peer-deps 2>&1 | grep -v "playwright" || true
# Rebuild optional dependencies (fixes rollup native module)
RUN npm rebuild rollup 2>&1 | grep -v "playwright" || true
# Remove playwright browsers to save space (keep package for type checking)
RUN npx playwright uninstall 2>/dev/null || true

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
