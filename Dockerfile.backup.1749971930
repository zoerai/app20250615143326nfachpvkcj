# Universal Node.js Application Dockerfile
# Based on Next.js best practices, supports all Node.js apps
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f yarn.lock ]; then \
    echo "Installing with yarn..." && yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    echo "Installing with npm ci..." && npm ci; \
  elif [ -f pnpm-lock.yaml ]; then \
    echo "Installing with pnpm..." && corepack enable pnpm && pnpm i --frozen-lockfile; \
  else \
    echo "No lockfile found, using npm install..." && npm install; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# Detect and build application
RUN \
  if [ -f "next.config.js" ] || [ -f "next.config.mjs" ] || [ -f "next.config.ts" ]; then \
    echo "Building Next.js application with standalone output..." && \
    npm run build; \
  elif grep -q '"build"' package.json; then \
    echo "Building application with npm run build..." && \
    npm run build; \
  else \
    echo "No build script found, skipping build step..."; \
  fi

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Copy the whole application first
COPY --from=builder --chown=appuser:nodejs /app ./

# For Next.js apps with standalone build, reorganize the structure
RUN \
  if [ -d ".next/standalone" ]; then \
    echo "Setting up Next.js standalone structure..." && \
    # First backup the static directory if it exists \
    if [ -d ".next/static" ]; then mv .next/static /tmp/next-static; fi && \
    # Copy all standalone files to root \
    cp -r .next/standalone/* . && \
    # Restore static directory to proper location \
    if [ -d "/tmp/next-static" ]; then \
      mkdir -p .next && \
      mv /tmp/next-static .next/static; \
    fi && \
    # Copy public folder to root if it exists in standalone \
    if [ -d ".next/standalone/public" ]; then cp -r .next/standalone/public .; fi && \
    # Set proper ownership \
    chown -R appuser:nodejs .next && \
    echo "Next.js standalone setup completed"; \
  else \
    echo "Standard Node.js application setup"; \
  fi

USER appuser

# Expose port 3000 (fixed internal port)
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Universal start command with Next.js priority
CMD \
  if [ -f "server.js" ] && [ -d ".next" ]; then \
    echo "Starting Next.js standalone server..." && node server.js; \
  elif [ -f "server.js" ]; then \
    echo "Starting with server.js..." && node server.js; \
  elif [ -f "index.js" ]; then \
    echo "Starting with index.js..." && node index.js; \
  elif [ -f "app.js" ]; then \
    echo "Starting with app.js..." && node app.js; \
  elif grep -q '"start"' package.json 2>/dev/null; then \
    echo "Starting with npm start..." && npm start; \
  else \
    echo "No start script found, using default..." && node index.js; \
  fi 