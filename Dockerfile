# === Stage 1: Build (install deps) ===
FROM node:18-alpine AS deps
WORKDIR /app

# copy package files first to install dependencies (cache friendly)
COPY package.json package-lock.json* ./

# Install only production deps
RUN npm ci --only=production

# === Stage 2: App image ===
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy app source
COPY . .

# Environment setup
ENV NODE_ENV=production
ENV PORT=3000

# Use non-root user
USER appuser

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
