#!/bin/sh
set -e

# Ensure node_modules/.bin is in PATH
export PATH="/app/node_modules/.bin:$PATH"

# Run from /app/apps/remix directory
cd /app/apps/remix

# Build the app with Vite (React Router plugin is configured in vite.config.ts)
echo "Building with Vite..."
NODE_ENV=production vite build

# Build the server with rollup
echo "Building server with rollup..."
NODE_ENV=production rollup -c rollup.config.mjs

echo "Build complete!"
