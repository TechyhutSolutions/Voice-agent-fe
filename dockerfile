# syntax=docker/dockerfile:1.6

# -----------------------
# deps
# -----------------------
FROM node:20-alpine AS deps
WORKDIR /app

# Some native deps need this on alpine
RUN apk add --no-cache libc6-compat

# Copy lockfiles first for better caching
COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./

# Install deps (prefer pnpm if pnpm-lock exists)
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
  else npm i; \
  fi

# -----------------------
# builder
# -----------------------
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable && pnpm run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f yarn.lock ]; then corepack enable && yarn build; \
  else npm run build; \
  fi

# -----------------------
# runner
# -----------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Standalone output contains server.js + minimal node_modules inside /app/.next/standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
