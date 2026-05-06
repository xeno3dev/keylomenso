#!/bin/sh
set -e

# Run from /app/apps/remix where vite.config.ts is located
cd /app/apps/remix

# Build the app - react-router build handles vite config automatically
echo "Building with react-router..."
NODE_ENV=production npx react-router build

# Build the server with rollup
echo "Building server with rollup..."
NODE_ENV=production npx rollup -c rollup.config.mjs

echo "Build complete!"

