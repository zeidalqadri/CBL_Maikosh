# Multi-stage build for production optimization
# Build stage
FROM node:20-alpine AS builder

# Install security updates and required dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json* ./

# Install ALL dependencies (including dev) for the build stage
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application with optimizations
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV GENERATE_SOURCEMAP=false

RUN npm run build

# Production stage
FROM node:20-alpine AS runner

# Install security updates
RUN apk update && apk upgrade && \
    apk add --no-cache libc6-compat curl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy package.json for reference (but not node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Create necessary directories
RUN mkdir -p /app/.next/cache && \
    chown -R nextjs:nodejs /app/.next/cache

# Switch to non-root user for security
USER nextjs

# Set environment variables for production
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=8080
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 8080

# Health check for Cloud Run
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Start the application
CMD ["node", "server.js"]